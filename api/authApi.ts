import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

// SIGNUP
// export const signupAPI = async (
//     email: string,
//     password: string,
//     userData: any,
//     groupId?: string
//   ) => {
//     const res = await createUserWithEmailAndPassword(auth, email, password);
  
//     // 🔥 ALWAYS MEMBER
//     await setDoc(doc(db, "users", res.user.uid), {
//       ...userData,
//       email,
//       role: "MEMBER",
//       createdAt: new Date().toISOString(),
//     });
  
//     // Join group if provided
//     if (groupId) {
//       await setDoc(doc(collection(db, "groupMembers")), {
//         userId: res.user.uid,
//         groupId,
//         role: "MEMBER",
//       });
//     }
  
//     return res.user;
//   };

export const signupAPI = async (
    email: string,
    password: string,
    userData: any,
    groupId?: string,
    joinType?: string
  ) => {
    // 1. Create Auth user
    const res = await createUserWithEmailAndPassword(auth, email, password);
  
    const uid = res.user.uid;
  
    // 2. Save in Firestore
    await setDoc(doc(db, "users", uid), {
      ...userData,
      email,
      role: "MEMBER", // 🔥 always member
      createdAt: new Date().toISOString(),
    });
  
    // 3. Join group if provided
    if (groupId) {
      await setDoc(doc(collection(db, "groupMembers")), {
        userId: uid,
        groupId,
        role: "MEMBER",
      
        membershipType: joinType,
      
        status:
          joinType === "MEMBER"
            ? "PENDING"
            : "APPROVED",
      
        createdAt: new Date().toISOString(),
      });
    }
  
    return res.user;
  };

// LOGIN
export const loginAPI = async (email: string, password: string) => {
  const res = await signInWithEmailAndPassword(auth, email, password);

  const userDoc = await getDoc(doc(db, "users", res.user.uid));

  return {
    authUser: res.user,
    userData: {
        ...userDoc.data(),
        uid: res.user.uid,
    }
  };
};

export const logoutAPI = async () => {
    await signOut(auth);
  };
