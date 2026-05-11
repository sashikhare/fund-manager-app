import {
    addDoc,
    collection,
    doc,
    getDoc,
    onSnapshot,
    updateDoc
} from "firebase/firestore";
import { db } from "../firebase/firebase";

export const subscribeEvents = (callback: (data: any[]) => void) => {
    return onSnapshot(collection(db, "events"), (snapshot) => {
      const events = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      callback(events);
    });
  };

  export const updateEventMemberAPI = async (
    eventId: string,
    memberId: string,
    amount: number
  ) => {
    const eventRef = doc(db, "events", eventId);
  
    // get current event
    // NOTE: Firestore doesn't support partial array update easily
    // so we overwrite full members array
  
    const snapshot = await getDoc(eventRef);
    const event = snapshot.data();
  
    const updatedMembers = event.members.map((m: any) =>
      m.memberId === memberId ? { ...m, paid: amount } : m
    );
  
    await updateDoc(eventRef, {
      members: updatedMembers,
    });
  };

// CREATE EVENT
export const createEventAPI = async (event: any) => {
  const docRef = await addDoc(collection(db, "events"), event);
  return { id: docRef.id, ...event };
};

// SETTLE EVENT
export const settleEventAPI = async (eventId: string) => {
  await updateDoc(doc(db, "events", eventId), {
    isSettled: true,
  });
};