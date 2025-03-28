import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDBLzvGOFOsLQI_7THWuKGiV-GGmloB8XI",
  authDomain: "colorbet-16ff0.firebaseapp.com",
  projectId: "colorbet-16ff0",
  storageBucket: "colorbet-16ff0.firebasestorage.app",
  messagingSenderId: "217740983783",
  appId: "1:217740983783:web:2481fb797787f4bca21142",
  measurementId: "G-KC2GQNLSP6"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const storage = getStorage(app);
export const realTimeDb = getDatabase(app);