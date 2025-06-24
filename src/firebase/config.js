// Firebase config setup
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ⛔ Replace with your actual Firebase config values from your Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyArGcaXBxbPIq9up88Nge7cWhGGIaUYbNo",
  authDomain: "churpapp.firebaseapp.com",
  projectId: "churpapp",
  storageBucket: "churpapp.appspot.com",
//   messagingSenderId: "YOUR_SENDER_ID",
  appId: "churpapp"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export auth and firestore instances
export const auth = getAuth(app);
export const db = getFirestore(app);
