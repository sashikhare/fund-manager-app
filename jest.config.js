module.exports = {
  preset: "jest-expo",
  testMatch: ["**/__tests__/**/*.test.[jt]s?(x)"],
  collectCoverageFrom: [
    "redux/**/*.{ts,tsx}",
    "!redux/store.ts",
  ],
  coveragePathIgnorePatterns: ["/node_modules/"],
};
