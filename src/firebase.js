// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyChmx3J9-ApyEr8aBk8FMPs_dxhBpyf5HU",
    authDomain: "hrcm-ffe46.firebaseapp.com",
    projectId: "hrcm-ffe46",
    storageBucket: "hrcm-ffe46.appspot.com",
    messagingSenderId: "15808191361",
    appId: "1:15808191361:web:070a59c6437e8398b6a680",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
