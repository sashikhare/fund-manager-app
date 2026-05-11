import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

// SIGNUP
export const signupAPI = async (email: string, password: string, userData: any) => {
  const res = await createUserWithEmailAndPassword(auth, email, password);

  await setDoc(doc(db, "users", res.user.uid), {
    ...userData,
  });

  return res.user;
};

// LOGIN
export const loginAPI = async (email: string, password: string) => {
  const res = await signInWithEmailAndPassword(auth, email, password);

  const userDoc = await getDoc(doc(db, "users", res.user.uid));

  return {
    authUser: res.user,
    userData: userDoc.data(),
  };
};

export const logoutAPI = async () => {
    await signOut(auth);
  };