// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCNANtxbWOGOfpCH9Ha6lcrMSkcKD8qBmY",
  authDomain: "inventory-management-a0933.firebaseapp.com",
  projectId: "inventory-management-a0933",
  storageBucket: "inventory-management-a0933.appspot.com",
  messagingSenderId: "395637059516",
  appId: "1:395637059516:web:fc3d65fe9a9f97895cc5b9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)

export {firestore}