// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, initializeAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCwflIQm7Awr_IH7otjrk0iwrZkMw90j3s",
  authDomain: "dashboard-bb512.firebaseapp.com",
  projectId: "dashboard-bb512",
  storageBucket: "dashboard-bb512.firebasestorage.app",
  messagingSenderId: "829656825776",
  appId: "1:829656825776:web:bad5b6cd2721e915fea075",
  measurementId: "G-TEX147QFMQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)