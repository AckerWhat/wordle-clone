import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyCqfg3-WoA0M7mYKU3l_GyBU958bVC3o9o",
  authDomain: "wordle-9ae43.firebaseapp.com",
  projectId: "wordle-9ae43",
  storageBucket: "wordle-9ae43.firebasestorage.app",
  messagingSenderId: "295284868265",
  appId: "1:295284868265:web:684b7710cbcf520e5a95b8",
  measurementId: "G-9N0SM2BBT9"
};

const app = initializeApp(firebaseConfig);
export const FIREBASE_DB = getFirestore(app);