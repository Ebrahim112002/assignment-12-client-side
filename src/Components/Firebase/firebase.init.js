// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyALm8ZSBwpnjsPyq8p8IxyB_CQ0fDh1pZ4",
  authDomain: "matrimonial-project-5b64e.firebaseapp.com",
  projectId: "matrimonial-project-5b64e",
  storageBucket: "matrimonial-project-5b64e.firebasestorage.app",
  messagingSenderId: "509868821880",
  appId: "1:509868821880:web:fe598b693ce0362f264c8d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);