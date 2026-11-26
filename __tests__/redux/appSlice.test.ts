import reducer, {
  addEvent,
  addFund,
  addMember,
  addSpending,
  deleteMembers,
  setData,
  setFund,
  setSelectedGroup,
  setUser,
  settleEvent,
  updateEventMember,
} from '../../redux/appSlice';
import type { AppState, EventItem, Group, Member, User } from '../../types';

const initialState: AppState = {
  members: [],
  fund: 0,
  events: [],
  transactions: [],
  currentUser: null,
  selectedGroup: null,
};

const member: Member = {
  id: 'member-1',
  firstName: 'Asha',
  lastName: 'Shah',
};

const event: EventItem = {
  id: 'event-1',
  name: 'Sunday Turf',
  date: '2026-11-29',
  members: [{ memberId: 'member-1', paid: 500 }],
  turfBookingAmount: 300,
  isSettled: false,
  groupId: 'group-1',
  createdBy: 'admin-1',
};

describe('appSlice', () => {
  it('returns the initial application state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('adds and deletes members by ID', () => {
    const withMembers = reducer(initialState, addMember(member));
    expect(withMembers.members).toEqual([member]);

    const afterDelete = reducer(
      withMembers,
      deleteMembers(['member-1']),
    );
    expect(afterDelete.members).toEqual([]);
  });

  it('adds fund and records an ADD transaction', () => {
    const next = reducer(initialState, addFund({ amount: 1000 }));

    expect(next.fund).toBe(1000);
    expect(next.transactions).toHaveLength(1);
    expect(next.transactions[0]).toMatchObject({
      type: 'ADD',
      title: 'Added Fund',
      amount: 1000,
    });
    expect(next.transactions[0].id).toEqual(expect.any(String));
    expect(next.transactions[0].date).toEqual(expect.any(String));
  });

  it('records spending and subtracts it from the fund', () => {
    const state = { ...initialState, fund: 1000 };
    const next = reducer(
      state,
      addSpending({ title: 'Booking', amount: 350 }),
    );

    expect(next.fund).toBe(650);
    expect(next.transactions[0]).toMatchObject({
      type: 'SPEND',
      title: 'Booking',
      amount: 350,
    });
  });

  it('sets the fund and records the balance adjustment', () => {
    const next = reducer(initialState, setFund(750));

    expect(next.fund).toBe(750);
    expect(next.transactions[0]).toMatchObject({
      type: 'ADD',
      title: 'Balance Set',
      amount: 750,
    });
  });

  it('adds an event and updates a participating member payment', () => {
    const withEvent = reducer(initialState, addEvent(event));
    const next = reducer(
      withEvent,
      updateEventMember({
        eventId: 'event-1',
        memberId: 'member-1',
        amount: 800,
      }),
    );

    expect(next.events[0].members[0].paid).toBe(800);
  });

  it('does not fail when an event or event member is not found', () => {
    const withEvent = reducer(initialState, addEvent(event));

    expect(
      reducer(withEvent, updateEventMember({
        eventId: 'missing-event',
        memberId: 'member-1',
        amount: 100,
      })),
    ).toEqual(withEvent);

    expect(
      reducer(withEvent, updateEventMember({
        eventId: 'event-1',
        memberId: 'missing-member',
        amount: 100,
      })),
    ).toEqual(withEvent);
  });

  it('settles an event, updates the fund, and records the settlement', () => {
    const withEvent = reducer(initialState, addEvent(event));
    const next = reducer(withEvent, settleEvent({ eventId: 'event-1' }));

    expect(next.fund).toBe(200);
    expect(next.events[0].isSettled).toBe(true);
    expect(next.transactions[0]).toMatchObject({
      type: 'EVENT',
      title: 'Sunday Turf settlement',
      amount: 200,
    });
  });

  it('does nothing when asked to settle an unknown event', () => {
    expect(
      reducer(initialState, settleEvent({ eventId: 'missing-event' })),
    ).toEqual(initialState);
  });

  it('stores the selected group and current user', () => {
    const group: Group = {
      id: 'group-1',
      groupId: 'group-1',
      name: 'Weekend Football',
    };
    const user: User = {
      uid: 'admin-1',
      email: 'admin@example.com',
      role: 'ADMIN',
    };

    const withGroup = reducer(initialState, setSelectedGroup(group));
    const next = reducer(withGroup, setUser(user));

    expect(next.selectedGroup).toEqual(group);
    expect(next.currentUser).toEqual(user);
  });

  it('loads persisted state and defaults missing transactions to an empty array', () => {
    const persistedState = {
      ...initialState,
      fund: 250,
      transactions: undefined,
    } as unknown as AppState;

    const next = reducer(initialState, setData(persistedState));

    expect(next.fund).toBe(250);
    expect(next.transactions).toEqual([]);
  });
});
