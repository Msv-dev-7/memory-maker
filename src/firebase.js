// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA8BwDqQx2qNuakhSOREPsX_AmCFNs3QRY",
  authDomain: "memorymapapp-aef59.firebaseapp.com",
  projectId: "memorymapapp-aef59",
  appId: "1:992083363773:web:85a2004586ae87b352b4d4",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
