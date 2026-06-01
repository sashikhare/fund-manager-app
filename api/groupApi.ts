import { addDoc, collection, doc, getDoc, getDocs, onSnapshot, query, setDoc, where } from "firebase/firestore";
import { db } from "../firebase/firebase";

// 🔥 Generate random group ID
const generateGroupId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";

  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
};

// CREATE GROUP
export const createGroupAPI = async (data: any, adminId: string) => {
  const groupId = generateGroupId();

  // 1. Create group
  await setDoc(doc(db, "groups", groupId), {
    ...data,
    groupId,
    createdBy: adminId,
    createdAt: new Date().toISOString(),
  });

  // 2. Create fund for this group
  await setDoc(doc(db, "funds", groupId), {
    fund: data.openingBalance || 0,
    transactions: [
      {
        id: Date.now().toString(),
        type: "ADD",
        title: "Opening Balance",
        amount: data.openingBalance || 0,
        date: new Date().toISOString(),
      },
    ],
  });

  // 3. Add admin to group
  await setDoc(doc(collection(db, "groupMembers")), {
    userId: adminId,
    groupId,
    role: "ADMIN",
  });

  return groupId;
};

export const getGroupsByAdminAPI = async (adminId: string) => {
    const q = query(
      collection(db, "groups"),
      where("createdBy", "==", adminId)
    );
  
    const snapshot = await getDocs(q);
  
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  };

  export const joinGroupAPI = async (
    groupId: string,
    userId: string,
    membershipType: "MEMBER" | "GUEST"
  ) => {
    await addDoc(
      collection(db, "groupMembers"),
      {
        userId,
        groupId,
  
        role: "MEMBER",
  
        membershipType,
  
        status:
          membershipType === "MEMBER"
            ? "PENDING"
            : "APPROVED",
  
        createdAt:
          new Date().toISOString(),
      }
    );
  };

  export const getGroupStatsAPI = async (
    groupId: string
  ) => {
    const q = query(
      collection(db, "groupMembers"),
      where("groupId", "==", groupId)
    );
  
    const snapshot = await getDocs(q);
  
    let members = 0;
    let guests = 0;
    let pending = 0;
  
    snapshot.docs.forEach((doc) => {
      const data = doc.data();
  
      if (
        data.membershipType === "GUEST"
      ) {
        guests++;
      } else if (
        data.status === "PENDING"
      ) {
        pending++;
      } else {
        members++;
      }
    });
  
    return {
      total:
        members + guests + pending,
  
      members,
      guests,
      pending,
    };
  };

  export const getAllGroupsAPI = async () => {
    const snapshot = await getDocs(
      collection(db, "groups")
    );
  
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  };

  export const subscribeGroupsByAdminAPI = (
    adminEmail: string,
    callback: (data: any[]) => void
  ) => {
    const q = query(
      collection(db, "groups"),
      where("createdBy", "==", adminEmail)
    );
  
    return onSnapshot(q, (snapshot) => {
      const groups = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      callback(groups);
    });
  };

  export const getGroupsForUserAPI = async (
    userId: string
  ) => {
    // 1. Get joined group relations
    const q = query(
      collection(db, "groupMembers"),
      where("userId", "==", userId)
    );
  
    const snapshot = await getDocs(q);
  
    // 2. Fetch actual group data
    const groups = await Promise.all(
      snapshot.docs.map(async (relationDoc) => {
        const relationData = relationDoc.data();
  
        const groupDoc = await getDoc(
          doc(db, "groups", relationData.groupId)
        );
  
        if (!groupDoc.exists()) return null;
  
        return {
          id: groupDoc.id,
  
          groupId: relationData.groupId,
  
          ...groupDoc.data(),
  
          membershipType:
            relationData.membershipType,
  
          status: relationData.status,
        };
      })
    );
  
    return groups.filter(Boolean);
  };

  export const subscribeGroupsForUserAPI = (
    userId: string,
    callback: (groups: any[]) => void
  ) => {
    const q = query(
      collection(db, "groupMembers"),
      where("userId", "==", userId)
    );
  
    return onSnapshot(q, async (snapshot) => {
      const groups = await Promise.all(
        snapshot.docs.map(async (relationDoc) => {
          const relationData = relationDoc.data();
  
          const groupDoc = await getDoc(
            doc(db, "groups", relationData.groupId)
          );
  
          if (!groupDoc.exists()) return null;
  
          return {
            id: groupDoc.id,
            groupId: relationData.groupId,
            ...groupDoc.data(),
            membershipType: relationData.membershipType,
            status: relationData.status,
          };
        })
      );
  
      callback(groups.filter(Boolean));
    });
  };