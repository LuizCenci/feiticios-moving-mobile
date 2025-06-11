// src/config/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore"; // <- Adicione esta linha

const firebaseConfig = {
  apiKey: "AIzaSyCFkCax1VstY8FYU-i2B0QG7JdMC2EX1z0",
  authDomain: "feiticos-moving.firebaseapp.com",
  databaseURL: "https://feiticos-moving-default-rtdb.firebaseio.com",
  projectId: "feiticos-moving",
  storageBucket: "feiticos-moving.appspot.com",
  messagingSenderId: "197410099093",
  appId: "1:197410099093:web:f4760a853654e677f0309c"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const database = getDatabase(app);
const db = getFirestore(app); // <- Adicione esta linha

export { app, auth, database, db }; // <- Exporte o Firestore como 'db'

