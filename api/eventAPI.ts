import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
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
  const docRef = await addDoc(collection(db, "events"), {
    ...event,
    createdAt: new Date().toISOString(),
  });
  return { id: docRef.id, ...event };
};

// SETTLE EVENT
export const settleEventAPI = async (eventId: string) => {
  await updateDoc(doc(db, "events", eventId), {
    isSettled: true,
  });
};

export const getEventsByGroupAPI = async (groupId: string) => {
  const q = query(collection(db, "events"), where("groupId", "==", groupId));

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const joinEventAPI = async (
  eventId: string,
  userId: string,
  groupId: string
) => {
  // Event
  const eventRef = doc(db, "events", eventId);
  const eventDoc = await getDoc(eventRef);

  if (!eventDoc.exists()) {
    throw new Error("Event not found");
  }

  // Group
  const groupRef = doc(db, "groups", groupId);
  const groupDoc = await getDoc(groupRef);

  if (!groupDoc.exists()) {
    throw new Error("Group not found");
  }

  // User membership in this group
  const membershipQuery = query(
    collection(db, "groupMembers"),
    where("groupId", "==", groupId),
    where("userId", "==", userId)
  );

  const membershipSnapshot =
    await getDocs(membershipQuery);

  if (membershipSnapshot.empty) {
    throw new Error(
      "You are not part of this group"
    );
  }

  const membership =
    membershipSnapshot.docs[0].data();

  // MEMBER requires approval
  if (
    membership.membershipType === "MEMBER" &&
    membership.status !== "APPROVED"
  ) {
    throw new Error(
      "Awaiting admin approval"
    );
  }

  const eventData = eventDoc.data();
  const groupData = groupDoc.data();

  const members = eventData.members || [];

  // Already joined?
  const alreadyJoined = members.some(
    (m: any) => m.memberId === userId
  );

  if (alreadyJoined) {
    throw new Error(
      "Already joined this event"
    );
  }

  const fee =
    membership.membershipType === "MEMBER"
      ? groupData.memberFee
      : groupData.guestFee;

  members.push({
    memberId: userId,

    membershipType:
      membership.membershipType,

    fee,

    paid: 0,

    joinedAt:
      new Date().toISOString(),
  });

  await updateDoc(eventRef, {
    members,
  });
};

export const subscribeEventsByGroupAPI = (
  groupId: string,
  callback: (events: any[]) => void
) => {
  const q = query(collection(db, "events"), where("groupId", "==", groupId));

  return onSnapshot(q, (snapshot) => {
    const events = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .sort(
        (a: any, b: any) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );

    callback(events);
  });
};
