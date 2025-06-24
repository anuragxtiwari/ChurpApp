// Firebase config setup
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ⛔ Replace with your actual Firebase config values from your Firebase Console
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
//   messagingSenderId: "YOUR_SENDER_ID",
  appId: "your-app-id"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export auth and firestore instances
export const auth = getAuth(app);
export const db = getFirestore(app);
