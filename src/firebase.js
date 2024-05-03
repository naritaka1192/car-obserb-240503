// Import the functions you need from the SDKs you need

//car-test

import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBsgESH4zpZnR1rd0XnBfTGTz3LIDlC9b4",
  authDomain: "car-test-3236e.firebaseapp.com",
  projectId: "car-test-3236e",
  storageBucket: "car-test-3236e.appspot.com",
  messagingSenderId: "199965776831",
  appId: "1:199965776831:web:c77c5db6c9d71b80625f0a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
const auth = getAuth(app);

export { auth };