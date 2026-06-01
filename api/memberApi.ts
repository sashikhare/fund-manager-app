import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

// 🔥 REALTIME LISTENER
export const subscribeMembers = (callback: (data: any[]) => void) => {
  return onSnapshot(collection(db, "members"), (snapshot) => {
    const members = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    callback(members);
  });
};

// CREATE
export const createMemberAPI = async (member: any) => {
  const ref = await addDoc(collection(db, "members"), member);
  return { id: ref.id, ...member };
};

// GET ALL
export const getMembersAPI = async () => {
  const snap = await getDocs(collection(db, "members"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// DELETE (one)
export const deleteMemberAPI = async (id: string) => {
  await deleteDoc(doc(db, "members", id));
};

export const getMembersByGroupAPI = async (groupId: string) => {
  // 1. Get group member relations
  const q = query(
    collection(db, "groupMembers"),
    where("groupId", "==", groupId)
  );

  const snapshot = await getDocs(q);

  // 2. Fetch actual user details
  const members = await Promise.all(
    snapshot.docs.map(async (groupMemberDoc) => {
      const data = groupMemberDoc.data();

      const userDoc = await getDoc(doc(db, "users", data.userId));

      if (!userDoc.exists()) return null;

      return {
        id: userDoc.id,
        ...userDoc.data(),
        membershipType: data.membershipType,
        status: data.status,
      };
    })
  );

  // 3. Remove nulls
  return members.filter(Boolean);
};

export const getPendingMembersAPI = async (
  groupId: string
) => {
  const q = query(
    collection(db, "groupMembers"),

    where("groupId", "==", groupId),

    where(
      "membershipType",
      "==",
      "MEMBER"
    ),

    where("status", "==", "PENDING")
  );

  const snapshot = await getDocs(q);

  const members = await Promise.all(
    snapshot.docs.map(async (relationDoc) => {
      const relationData = relationDoc.data();

      const userDoc = await getDoc(
        doc(db, "users", relationData.userId)
      );

      if (!userDoc.exists()) return null;

      return {
        relationId: relationDoc.id,

        id: userDoc.id,

        ...userDoc.data(),
      };
    })
  );

  return members.filter(Boolean);
};

export const approveMemberAPI = async (
  relationId: string
) => {
  await updateDoc(
    doc(db, "groupMembers", relationId),
    {
      status: "APPROVED",
    }
  );
};

export const getEligibleEventMembersAPI = async (
  groupId: string
) => {
  const members = await getMembersByGroupAPI(
    groupId
  );

  return members.filter(
    (member: any) =>
      member.membershipType === "GUEST" ||
      (
        member.membershipType === "MEMBER" &&
        member.status === "APPROVED"
      )
  );
};
