// TODO: Replace with YOUR Firebase project's config.
// Firebase Console -> Project settings -> General -> Your apps -> Web app
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyABl89Je_ZDfZE5ULWRijopE23n58fvMT4",
  authDomain: "cognifyai-466e1.firebaseapp.com",
  projectId: "cognifyai-466e1",
  storageBucket: "cognifyai-466e1.firebasestorage.app",
  messagingSenderId: "25909995829",
  appId: "1:25909995829:web:0090927dafbc0abf2e447c"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
