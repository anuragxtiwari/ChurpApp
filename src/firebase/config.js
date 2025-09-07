// Firebase config setup
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ⛔ Replace with your actual Firebase config values from your Firebase Console
const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: "churpapp.firebaseapp.com",
  projectId: "churpapp",
  storageBucket: "churpapp.appspot.com",]
  appId: "churpapp"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export auth and firestore instances
export const auth = getAuth(app);
export const db = getFirestore(app);
