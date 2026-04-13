import React, { useState } from 'react';
import { useFirestoreTracking } from '../hooks/useFirestoreTracking';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Package,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Ship,
  Box,
  ArrowRight,
  Globe,
  Anchor,
  Plane
} from 'lucide-react';

const C = {
  electric: "#B11E22",
  electricLight: "#d96568",
  text: "#111827",
  textMuted: "#6b7280",
  border: "#e5e7eb",
  bgSubtle: "#f9fafb",
  bgCard: "#ffffff"
};

const TrackingVisualizer = ({ initialId = "" }) => {
  const [searchInput, setSearchInput] = useState(initialId);
  const [trackingId, setTrackingId] = useState(initialId);
  const { data, loading, error } = useFirestoreTracking(trackingId);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setTrackingId(searchInput.trim());
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusProgress = (status) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('entregado')) return 100;
    if (s.includes('aduana')) return 75;
    if (s.includes('tránsito') || s.includes('transito')) return 50;
    if (s.includes('procesando')) return 25;
    if (s.includes('recibido')) return 10;
    return 0;
  };

  return (
    <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto', padding: '10px' }}>

      {/* Search Input Section */}
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <p style={{ color: C.textMuted, fontSize: '0.875rem', marginBottom: '20px' }}>
          Ingrese su <b>Número de Tracking</b> o sus <b>Marcas de Embarque (Shipping Marks)</b>.
        </p>

        <form onSubmit={handleSearch} style={{
          display: 'flex',
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '14px',
          padding: '4px',
          alignItems: 'center',
          maxWidth: '500px',
          margin: '0 auto',
          boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
        }}>
          <div style={{ padding: '0 12px', color: '#9ca3af' }}>
            <Search size={18} />
          </div>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Ej: T1234 o TAM-XYZ"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: C.text,
              fontSize: '0.95rem',
              padding: '10px 0'
            }}
          />
          <button
            type="submit"
            style={{
              background: C.electric,
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              padding: '8px 20px',
              fontWeight: '700',
              cursor: 'pointer',
              marginLeft: '8px',
              fontSize: '0.85rem'
            }}
          >
            BUSCAR
          </button>
        </form>
      </div>

      <div style={{ minHeight: '300px' }}>
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '60px' }}
            >
              <div style={{
                width: '40px', height: '40px', border: '3px solid #f3f4f6',
                borderTopColor: C.electric, borderRadius: '50%', animation: 'spin 1s linear infinite'
              }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <p style={{ color: C.textMuted, marginTop: '16px', fontWeight: '500', fontSize: '0.9rem' }}>Localizando paquete...</p>
            </motion.div>
          )}

          {error && !loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              style={{ padding: '24px', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '16px', textAlign: 'center' }}
            >
              <AlertCircle size={32} color={C.electric} style={{ marginBottom: '12px' }} />
              <h3 style={{ color: '#991b1b', marginBottom: '6px', fontWeight: '700', fontSize: '1rem' }}>No se pudo encontrar</h3>
              <p style={{ color: '#b91c1c', fontSize: '0.85rem' }}>{error}</p>
            </motion.div>
          )}

          {data && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
            >
              {/* Main Info Card */}
              <div style={{
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '20px',
                padding: '24px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
                  <div>
                    <p style={{ fontSize: '0.65rem', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>ID de Tracking</p>
                    <h3 style={{ fontSize: '1.5rem', color: C.text, margin: '2px 0', fontWeight: '800' }}>{data.id}</h3>
                  </div>
                  <div style={{
                    padding: '6px 14px',
                    borderRadius: '100px',
                    background: '#fef2f2',
                    border: '1px solid #fee2e2',
                    color: C.electric,
                    fontWeight: '700',
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <CheckCircle2 size={14} /> {data.status?.toUpperCase()}
                  </div>
                </div>

                {data.shipping_marks && (
                  <div style={{ marginBottom: '24px', padding: '14px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <p style={{ fontSize: '0.6rem', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '800', marginBottom: '6px' }}>Marcas de Embarque / Shipping Marks</p>
                    <p style={{ margin: 0, fontWeight: '700', color: C.text, fontSize: '0.95rem' }}>{data.shipping_marks}</p>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '16px', paddingTop: '20px', borderTop: '1px solid #f3f4f6' }}>
                  <div>
                    <p style={{ fontSize: '0.6rem', color: C.textMuted, textTransform: 'uppercase', fontWeight: '700' }}>Medio</p>
                    <p style={{ color: C.text, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px', fontWeight: '500' }}>
                      {data.transport_type === 'air' ? <Plane size={14} color={C.electric} /> : data.transport_type === 'sea' ? <Ship size={12} color={C.electric} /> : <Truck size={12} color={C.electric} />}
                      {data.transport_type === 'air' ? 'Aéreo' : data.transport_type === 'sea' ? 'Marítimo' : 'Terrestre'}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.6rem', color: C.textMuted, textTransform: 'uppercase', fontWeight: '700' }}>Destino Final</p>
                    <p style={{ color: C.text, fontSize: '0.85rem', marginTop: '3px', fontWeight: '500' }}>{data.destination || 'Por definir'}</p>
                  </div>
                </div>
              </div>

              {/* History Section */}
              <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '20px', padding: '24px' }}>
                <h4 style={{ color: C.text, fontSize: '1rem', fontWeight: '800', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Clock size={16} color={C.electric} /> Historial Detallado
                </h4>

                <div style={{ position: 'relative', paddingLeft: '32px' }}>
                  {/* Vertical Line */}
                  <div style={{ position: 'absolute', left: '7px', top: '5px', bottom: '5px', width: '2px', background: '#f3f4f6' }} />

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    {data.steps?.map((step, index) => (
                      <div key={index} style={{ position: 'relative' }}>
                        {/* Dot */}
                        <div style={{
                          position: 'absolute', left: '-30px', top: '2px', width: '12px', height: '12px',
                          borderRadius: '50%', background: index === 0 ? C.electric : '#d1d5db',
                          border: '2px solid #fff', zIndex: 2
                        }} />

                        <div>
                          <p style={{ color: index === 0 ? C.text : '#4b5563', fontWeight: '700', fontSize: '0.9rem' }}>{step.desc}</p>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '4px' }}>
                            {step.desc !== 'En Tránsito Internacional' && (
                              <span style={{ fontSize: '0.7rem', color: C.textMuted, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <MapPin size={10} /> {step.location}
                              </span>
                            )}
                            <span style={{ fontSize: '0.7rem', color: C.textMuted, display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Clock size={10} /> {step.date}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {!data && !loading && !error && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 16px', border: '2px dashed #f3f4f6', borderRadius: '20px' }}
            >
              <div style={{ width: '60px', height: '60px', background: '#f9fafb', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Package size={28} color="#d1d5db" />
              </div>
              <h3 style={{ color: C.text, fontWeight: '700', marginBottom: '6px', fontSize: '1rem' }}>Paquete no seleccionado</h3>
              <p style={{ color: C.textMuted, textAlign: 'center', fontSize: '0.8rem', maxWidth: '240px' }}>
                Por favor, introduzca un ID válido en el campo superior.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TrackingVisualizer;



