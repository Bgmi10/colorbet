import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyD3KoNEDXddpK1FVCNCuRpfk6a2ucGpt2g",
  authDomain: "colorbet-d8ae8.firebaseapp.com",
  projectId: "colorbet-d8ae8",
  storageBucket: "colorbet-d8ae8.firebasestorage.app",
  messagingSenderId: "445307958940",
  appId: "1:445307958940:web:a32c0ab3b65d4f1dbcdf59",
  measurementId: "G-HDV9MC3TXZ"
};

const app = initializeApp(firebaseConfig);

export const db =  getDatabase(app);
