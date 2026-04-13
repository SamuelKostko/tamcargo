import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCnYmvPYd3l6MxUi3T2LkkFtvemM0Sjhlc",
  authDomain: "sistema-tam-cargo.firebaseapp.com",
  projectId: "sistema-tam-cargo",
  storageBucket: "sistema-tam-cargo.firebasestorage.app",
  messagingSenderId: "309516541040",
  appId: "1:309516541040:web:7f3fd1ce9a0aa56c45e8b5",
  measurementId: "G-B3G39X5TXY"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const seedUpdatedData = async () => {
  const containerId = "CO-MIAMI-8899";
  
  // 1. Datos del Contenedor (Lo que el admin actualizará una sola vez)
  const containerDoc = {
    status: "EN NAVEGACIÓN",
    last_update: serverTimestamp(),
    steps: [
      {
        date: "09 Abr, 2024",
        desc: "Contenedor cargado y sellado",
        location: "Puerto de Miami, USA"
      },
      {
        date: "08 Abr, 2024",
        desc: "En despacho aduanal de salida",
        location: "Miami, USA"
      }
    ]
  };

  try {
    console.log("Creando contenedor maestro...");
    await setDoc(doc(db, "containers", containerId), containerDoc);

    // 2. Traking de Clientes (Vinculados al contenedor)
    console.log("Vinculando clientes al contenedor...");
    
    await setDoc(doc(db, "tracking", "CLIENTE-ALEX"), { container_id: containerId });
    await setDoc(doc(db, "tracking", "CLIENTE-JUAN"), { container_id: containerId });

    console.log("✅ ¡Sistema actualizado!");
    console.log(`\nCódigos de prueba para el usuario:`);
    console.log(`- CLIENTE-ALEX`);
    console.log(`- CLIENTE-JUAN`);
    console.log(`\nAmbos mostrarán la info del contenedor: ${containerId}`);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

seedUpdatedData();
