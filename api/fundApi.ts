import {
    doc,
    getDoc,
    onSnapshot,
    setDoc,
    updateDoc
} from "firebase/firestore";
import { db } from "../firebase/firebase";

const FUND_DOC = "main"; // single doc

export const subscribeFund = (callback: (data: any) => void) => {
    const ref = doc(db, "fund", FUND_DOC);
  
    return onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        callback(snap.data());
      }
    });
  };

// GET FUND
export const getFundAPI = async () => {
  const ref = doc(db, "fund", FUND_DOC);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    // initialize
    const initData = { fund: 0, transactions: [] };
    await setDoc(ref, initData);
    return initData;
  }

  return snap.data();
};

// INIT (only once)
export const initFund = async () => {
    const ref = doc(db, "fund", FUND_DOC);
    const snap = await getDoc(ref);
  
    if (!snap.exists()) {
      await setDoc(ref, { fund: 0, transactions: [] });
    }
  };
  

// UPDATE FUND
export const updateFundAPI = async (data: any) => {
  const ref = doc(db, "fund", FUND_DOC);
  await updateDoc(ref, data);
};