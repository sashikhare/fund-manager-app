import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    onSnapshot
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
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// DELETE (one)
export const deleteMemberAPI = async (id: string) => {
  await deleteDoc(doc(db, "members", id));
};