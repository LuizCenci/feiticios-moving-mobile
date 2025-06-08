// src/config/firebaseConfig.js
import { initializeApp } from "firebase/app";
//import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getDatabase } from "firebase/database";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importe o AsyncStorage

const firebaseConfig = {
  apiKey: "AIzaSyCFkCax1VstY8FYU-i2B0QG7JdMC2EX1z0",
  authDomain: "feiticos-moving.firebaseapp.com",
  databaseURL: "https://feiticos-moving-default-rtdb.firebaseio.com",
  projectId: "feiticos-moving",
  storageBucket: "feiticos-moving.firebasestorage.app",
  messagingSenderId: "197410099093",
  appId: "1:197410099093:web:f4760a853654e677f0309c"
};

const app = initializeApp(firebaseConfig);


const databaseInstance = getDatabase(app);

export { app, databaseInstance as database };