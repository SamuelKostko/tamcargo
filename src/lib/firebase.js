import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Configuración de Firebase para el proyecto Sistema TAM Cargo
const firebaseConfig = {
  apiKey: "AIzaSyCnYmvPYd3l6MxUi3T2LkkFtvemM0Sjhlc",
  authDomain: "sistema-tam-cargo.firebaseapp.com",
  projectId: "sistema-tam-cargo",
  storageBucket: "sistema-tam-cargo.firebasestorage.app",
  messagingSenderId: "309516541040",
  appId: "1:309516541040:web:7f3fd1ce9a0aa56c45e8b5",
  measurementId: "G-B3G39X5TXY"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar servicios
export const db = getFirestore(app);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
