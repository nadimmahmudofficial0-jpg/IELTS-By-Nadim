import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDd7XWOODt_rW3_Da8AHxeZqWBDe5HIhUY",
  authDomain: "ielts-by-nadim.firebaseapp.com",
  projectId: "ielts-by-nadim",
  storageBucket: "ielts-by-nadim.firebasestorage.app",
  messagingSenderId: "683032408054",
  appId: "1:683032408054:web:3b8ac1b2d1123156fda1d7",
  measurementId: "G-FSX13HY185"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const APP_ID = 'ielts-by-nadim';