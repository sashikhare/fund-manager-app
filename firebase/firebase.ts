import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBIMsrmiJsLOFkUS8W4PkFZtsFuXvOXCz8",
    authDomain: "turf-fund-app.firebaseapp.com",
    projectId: "turf-fund-app",
    storageBucket: "turf-fund-app.firebasestorage.app",
    messagingSenderId: "565884840549",
    appId: "1:565884840549:web:331f0d4ac34e577031748c"
  };
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);