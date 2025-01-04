import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyD3KoNEDXddpK1FVCNCuRpfk6a2ucGpt2g",
  authDomain: "colorbet-d8ae8.firebaseapp.com",
  projectId: "colorbet-d8ae8",
  storageBucket: "colorbet-d8ae8.firebasestorage.app",
  messagingSenderId: "445307958940",
  appId: "1:445307958940:web:a32c0ab3b65d4f1dbcdf59",
  databaseUrl: "https://colorbet-d8ae8-default-rtdb.asia-southeast1.firebasedatabase.app/",
  measurementId: "G-HDV9MC3TXZ"
};

const app = initializeApp(firebaseConfig);

export const db =  getFirestore(app);

export const storage = getStorage(app);
export const realTimeDb = getDatabase(app);