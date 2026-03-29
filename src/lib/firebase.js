// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCOLIou_yoLCBbau7tXOmxB7KOw8Hlz8CM",
  authDomain: "crowdyvote.firebaseapp.com",
  projectId: "crowdyvote",
  storageBucket: "crowdyvote.firebasestorage.app",
  messagingSenderId: "434213742801",
  appId: "1:434213742801:web:9af9b144379e4136d53df0",
  measurementId: "G-M9BWVS2KC7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);