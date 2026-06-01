import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState, EventItem, Member } from '../types';

const initialState: AppState = {
  members: [],
  fund: 0,
  events: [],
  transactions: [], // ✅ ADD THIS
  currentUser: null,
  selectedGroup: null
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    addMember: (state, action: PayloadAction<Member>) => {
      state.members.push(action.payload);
    },

    deleteMembers: (state, action: PayloadAction<string[]>) => {
      state.members = state.members.filter(
        m => !action.payload.includes(m.id)
      );
    },

    addFund: (state, action) => {
      state.transactions = state.transactions || [];
    
      state.fund += action.payload.amount;
    
      state.transactions.unshift({
        id: Date.now().toString(),
        type: "ADD",
        title: "Added Fund",
        amount: action.payload.amount,
        date: new Date().toISOString(),
      });
    },

    addSpending: (
      state,
      action: PayloadAction<{ title: string; amount: number }>
    ) => {
      state.fund -= action.payload.amount;
    
      state.transactions.unshift({
        id: Date.now().toString(),
        type: "SPEND",
        title: action.payload.title,
        amount: action.payload.amount,
        date: new Date().toISOString(),
      });
    },

    setFund: (state, action: PayloadAction<number>) => {
      state.fund = action.payload;
    
      state.transactions.unshift({
        id: Date.now().toString(),
        type: "ADD",
        title: "Balance Set",
        amount: action.payload,
        date: new Date().toISOString(),
      });
    },

    addEvent: (state, action: PayloadAction<EventItem>) => {
      state.events.unshift(action.payload);
    },

    updateEventMember: (
      state,
      action: PayloadAction<{
        eventId: string;
        memberId: string;
        amount: number;
      }>
    ) => {
      const event = state.events.find(
        (e) => e.id === action.payload.eventId
      );
      if (!event) return;

      const member = event.members.find(
        (m) => m.memberId === action.payload.memberId
      );

      if (member) {
        member.paid = action.payload.amount;
      }
    },

    settleEvent: (state, action: PayloadAction<{ eventId: string }>) => {
      const event = state.events.find(
        (e) => e.id === action.payload.eventId
      );
      if (!event) return;
    
      const totalCollected = event.members.reduce(
        (sum, m) => sum + (m.paid || 0),
        0
      );
    
      const remaining = totalCollected - event.turfBookingAmount;
    
      // ✅ Always update fund
      state.fund += remaining;
    
      // ✅ Always log transaction
      state.transactions.unshift({
        id: Date.now().toString(),
        type: "EVENT",
        title: `${event.name} settlement`,
        amount: remaining, // + or -
        date: new Date().toISOString(),
      });
    
      event.isSettled = true;
    },

    setData: (state, action: PayloadAction<AppState>) => {
      return {
        ...action.payload,
        transactions: action.payload.transactions || [], // ✅ fallback
      };
    },

    setEvents: (state, action) => {
      state.events = action.payload;
    },

    setMembers: (state, action) => {
      state.members = action.payload;
    },

    setFundData: (state, action) => {
      state.fund = action.payload.fund;
      state.transactions = action.payload.transactions;
    },

    setUser: (state, action) => {
      state.currentUser = action.payload;
    },

    setSelectedGroup: (state, action) => {
      state.selectedGroup = action.payload;
    },

  },
});

export const {
  addMember,
  deleteMembers,
  addFund,
  addSpending,
  addEvent,
  setData,
  setFund,
  updateEventMember,
  settleEvent,
  setEvents,
  setMembers,
  setFundData,
  setUser,
  setSelectedGroup
} = appSlice.actions;

export default appSlice.reducer;