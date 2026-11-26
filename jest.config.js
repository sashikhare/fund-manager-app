module.exports = {
  preset: 'jest-expo',

  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],

  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|expo-modules-core|@reduxjs/toolkit|immer|redux|@react-navigation/.*)/)',
  ],

  collectCoverageFrom: [
    'redux/**/*.{ts,tsx}',
    '!redux/store.ts',
  ],

  coveragePathIgnorePatterns: ['/node_modules/'],
};
