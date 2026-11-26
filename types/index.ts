export type UserRole = "SUPER_ADMIN" | "ADMIN" | "MEMBER";

export type MembershipType = "MEMBER" | "GUEST";

export type MembershipStatus = "PENDING" | "APPROVED";

export type TransactionType = "ADD" | "SPEND" | "EVENT";

export interface User {
  uid: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  [key: string]: unknown;
}

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  membershipType?: MembershipType;
  status?: MembershipStatus;
  [key: string]: unknown;
}

export interface Group {
  id: string;
  groupId: string;
  name: string;
  memberFee?: number;
  guestFee?: number;
  openingBalance?: number;
  role?: UserRole;
  membershipType?: MembershipType;
  status?: MembershipStatus;
  createdBy?: string;
  createdAt?: string;
  [key: string]: unknown;
}

export interface EventMember {
  memberId: string;
  paid: number;
  firstName?: string;
  lastName?: string;
  membershipType?: MembershipType;
  fee?: number;
  joinedAt?: string;
}

export interface EventItem {
  id: string;
  name: string;
  date: string;
  members: EventMember[];
  turfBookingAmount: number;
  isSettled: boolean;
  groupId?: string;
  createdBy?: string;
  createdAt?: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  title: string;
  amount: number;
  date: string;
}

export interface FundData {
  fund: number;
  transactions: Transaction[];
}

export interface GroupStats {
  total: number;
  members: number;
  guests: number;
  pending: number;
}

export interface AppState {
  members: Member[];
  fund: number;
  events: EventItem[];
  transactions: Transaction[];
  currentUser: User | null;
  selectedGroup: Group | null;
}
