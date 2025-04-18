// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAGozJRMz3c1XL-UaiH4WX3uL9nI1i5460",
  authDomain: "feastly-testing.firebaseapp.com",
  projectId: "feastly-testing",
  storageBucket: "feastly-testing.appspot.com", // ✅ fixed here
  messagingSenderId: "257343105473",
  appId: "1:257343105473:web:205fc74cc5d43fca88a740"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
