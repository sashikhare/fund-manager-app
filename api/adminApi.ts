import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "firebase/auth";
import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    setDoc
} from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

// CREATE ADMIN
export const createAdminAPI = async (
    email: string,
    password: string,
    data: any,
    currentUserEmail: string,
    currentUserPassword: string
  ) => {
    // 1. Create admin (this logs in admin)
    const res = await createUserWithEmailAndPassword(auth, email, password);
  
    // 2. Save admin in Firestore
    await setDoc(doc(db, "users", res.user.uid), {
      ...data,
      email,
      role: "ADMIN",
      createdAt: new Date().toISOString(),
    });
  
    // 3. Re-login SUPER ADMIN
    await signInWithEmailAndPassword(auth, currentUserEmail, currentUserPassword);
  };

// GET ADMINS
export const getAdminsAPI = async () => {
  const snapshot = await getDocs(collection(db, "users"));

  return snapshot.docs
    .map((doc) => ({
        id: doc.id,     // fallback
        ...doc.data(),
      }))
    .filter((u: any) => u.role === "ADMIN");
};

export const deleteAdminAPI = async (uid: string) => {
    await deleteDoc(doc(db, "users", uid));
  };