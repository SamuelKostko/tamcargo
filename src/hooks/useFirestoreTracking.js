import { useState, useEffect } from "react";
import { doc, onSnapshot, collection, query, where, limit } from "firebase/firestore";
import { db } from "../lib/firebase";

/**
 * Hook para escuchar cambios en tiempo real de un tracking vinculado a un Consolidado (BL).
 * Puede buscar por ID de documento o por Shipping Marks.
 */
export const useFirestoreTracking = (searchValue) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!searchValue) {
      setData(null);
      return;
    }

    setLoading(true);
    setError(null);

    let unsubscribePrimary = () => {};
    let unsubscribeMaster = () => {};

    // Función para manejar la data del tracking y buscar su master si existe
    const handleTrackingData = (trackingId, trackingData) => {
      const masterId = trackingData.container_id || trackingData.bl_id;

      if (masterId) {
        const masterRef = doc(db, "containers", masterId);
        unsubscribeMaster();
        unsubscribeMaster = onSnapshot(masterRef, (masterSnap) => {
          if (masterSnap.exists()) {
            setData({
              id: trackingId,
              ...trackingData,
              ...masterSnap.data(),
              master_id: masterId
            });
          } else {
            setData({ id: trackingId, ...trackingData });
          }
          setLoading(false);
        }, (err) => {
          setError("Error al obtener detalles del consolidado.");
          setLoading(false);
        });
      } else {
        setData({ id: trackingId, ...trackingData });
        setLoading(false);
      }
    };

    // 1. Intentamos buscar por ID directo
    const directRef = doc(db, "tracking", searchValue);
    unsubscribePrimary = onSnapshot(directRef, (snap) => {
      if (snap.exists()) {
        handleTrackingData(snap.id, snap.data());
      } else {
        // 2. Si no existe por ID, buscamos por Shipping Marks
        unsubscribePrimary(); // Cerramos la escucha directa
        const q = query(
          collection(db, "tracking"), 
          where("shipping_marks_array", "array-contains", searchValue.toUpperCase()),
          limit(1)
        );

        unsubscribePrimary = onSnapshot(q, (querySnap) => {
          if (!querySnap.empty) {
            const foundDoc = querySnap.docs[0];
            handleTrackingData(foundDoc.id, foundDoc.data());
          } else {
            setData(null);
            setError("No se encontró ninguna carga con ese ID o marcas de embarque.");
            setLoading(false);
          }
        }, (err) => {
          setError("Error al buscar por marcas de embarque.");
          setLoading(false);
        });
      }
    }, (err) => {
      setError("Error de conexión con el servidor.");
      setLoading(false);
    });

    return () => {
      unsubscribePrimary();
      unsubscribeMaster();
    };
  }, [searchValue]);

  return { data, loading, error };
};
