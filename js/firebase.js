// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDl2ugL1B-wyaF1qqMUpws4mFXvZ_dtLIk",
  authDomain: "certificate-generation-s-e6734.firebaseapp.com",
  projectId: "certificate-generation-s-e6734",
  storageBucket: "certificate-generation-s-e6734.firebasestorage.app",
  messagingSenderId: "545747088885",
  appId: "1:545747088885:web:2a4a2def426ca4760a5cbc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);