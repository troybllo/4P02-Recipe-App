// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAGozJRMz3c1XL-UaiH4WX3uL9nI1i5460",
  authDomain: "feastly-testing.firebaseapp.com",
  projectId: "feastly-testing",
  storageBucket: "feastly-testing.firebasestorage.app",
  messagingSenderId: "257343105473",
  appId: "1:257343105473:web:205fc74cc5d43fca88a740",
  measurementId: "G-CC0D8X3XH2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;