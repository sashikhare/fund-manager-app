export interface Member {
    id: string;
    firstName: string;
    lastName: string;
  }
  
  export interface EventItem {
    id: string;
    name: string;
    amount: number;
  }
  
  export interface AppState {
    members: Member[];
    fund: number;
    events: EventItem[];
    currentUser: null;
    selectedGroup: null,
  }

export type TransactionType = "ADD" | "SPEND" | "EVENT";

export interface Transaction {
  id: string;
  type: TransactionType;
  title: string;       // "Turf booking", "Snacks", etc.
  amount: number;
  date: string;
}

export interface AppState {
  members: Member[];
  fund: number;
  events: EventItem[];
  transactions: Transaction[]; // ⭐ NEW
}

export interface EventMember {
    memberId: string;
    paid: number; // how much they paid
  }
  
  export interface EventItem {
    id: string;
    name: string;
    date: string;
    members: EventMember[]; // only selected members
    turfBookingAmount: number;
    isSettled: boolean;
  }