import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCgRHi_NGgFvE19NzxpBI8qq4eMYMMivv8",
  authDomain: "login-auth-9bc3c.firebaseapp.com",
  projectId: "login-auth-9bc3c",
  storageBucket: "login-auth-9bc3c.firebasestorage.app",
  messagingSenderId: "322216598911",
  appId: "1:322216598911:web:32f9469d43d92b77614e4a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Authentication
const auth = getAuth(app);

// Initialize Storage
const storage = getStorage(app); // Initialize Firebase Storage

export { db, auth, storage };