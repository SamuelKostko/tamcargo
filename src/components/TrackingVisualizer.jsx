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

const MOBILE_CSS = `
  @keyframes spin { to { transform: rotate(360deg); } }
  .tv-root { width: 100%; max-width: 900px; margin: 0 auto; padding: 10px; box-sizing: border-box; }
  .tv-search-form { display: flex; background: #fff; border: 1px solid #e5e7eb; border-radius: 14px; padding: 4px; align-items: center; max-width: 500px; margin: 0 auto; box-shadow: 0 2px 4px rgba(0,0,0,0.02); box-sizing: border-box; }
  .tv-search-input { flex: 1; background: transparent; border: none; outline: none; color: #111827; font-size: 0.95rem; padding: 10px 0; min-width: 0; }
  .tv-search-btn { background: #B11E22; color: #fff; border: none; border-radius: 10px; padding: 9px 18px; font-weight: 700; cursor: pointer; margin-left: 6px; font-size: 0.85rem; flex-shrink: 0; white-space: nowrap; }
  .tv-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 20px; padding: 24px; box-shadow: 0 1px 2px rgba(0,0,0,0.03); box-sizing: border-box; }
  .tv-header-row { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 14px; margin-bottom: 20px; }
  .tv-id-eta-wrap { display: flex; align-items: flex-start; gap: 20px; flex-wrap: wrap; flex: 1; min-width: 0; }
  .tv-tracking-id { font-size: 1.5rem; color: #111827; margin: 2px 0; font-weight: 800; word-break: break-all; }
  .tv-eta-block { border-left: 1px solid #e5e7eb; padding-left: 20px; min-width: 0; }
  .tv-status-badge { padding: 6px 12px; border-radius: 100px; background: #fef2f2; border: 1px solid #fee2e2; color: #B11E22; font-weight: 700; font-size: 0.72rem; display: flex; align-items: center; gap: 5px; white-space: nowrap; flex-shrink: 0; }
  .tv-metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 14px; padding-top: 18px; border-top: 1px solid #f3f4f6; }
  .tv-history-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 20px; padding: 24px; box-sizing: border-box; }
  .tv-timeline-wrap { position: relative; padding-left: 30px; }
  .tv-timeline-line { position: absolute; left: 6px; top: 5px; bottom: 5px; width: 2px; background: #f3f4f6; }
  .tv-timeline-steps { display: flex; flex-direction: column; gap: 26px; }
  .tv-step { position: relative; }
  .tv-step-dot { position: absolute; left: -28px; top: 3px; width: 12px; height: 12px; border-radius: 50%; border: 2px solid #fff; z-index: 2; }
  .tv-step-desc { color: #4b5563; font-weight: 700; font-size: 0.88rem; margin: 0 0 4px; word-break: break-word; }
  .tv-step-desc.active { color: #111827; }
  .tv-step-meta { display: flex; flex-wrap: wrap; gap: 8px; }
  .tv-step-meta span { font-size: 0.7rem; color: #6b7280; display: flex; align-items: center; gap: 4px; }

  @media (max-width: 600px) {
    .tv-root { padding: 8px; }
    .tv-search-form { max-width: 100%; }
    .tv-card { padding: 14px; border-radius: 16px; }
    .tv-header-row { flex-direction: column; gap: 10px; }
    .tv-id-eta-wrap { flex-direction: column; gap: 10px; }
    .tv-eta-block { border-left: none; border-top: 1px solid #e5e7eb; padding-left: 0; padding-top: 10px; width: 100%; }
    .tv-tracking-id { font-size: 1.15rem; }
    .tv-status-badge { font-size: 0.68rem; }
    .tv-metrics-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
    .tv-history-card { padding: 14px; border-radius: 16px; }
    .tv-timeline-wrap { padding-left: 24px; }
    .tv-step-dot { left: -22px; width: 10px; height: 10px; }
    .tv-search-input { font-size: 0.85rem; }
    .tv-search-btn { padding: 9px 12px; font-size: 0.78rem; }
  }
`;

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

  return (
    <div className="tv-root">
      <style>{MOBILE_CSS}</style>

      {/* Search Input Section */}
      <div style={{ marginBottom: '28px', textAlign: 'center' }}>
        <p style={{ color: C.textMuted, fontSize: '0.85rem', marginBottom: '16px', padding: '0 8px', lineHeight: '1.5' }}>
          Ingrese su <b>Número de Tracking</b> o sus <b>Marcas de Embarque (Shipping Marks)</b>.
        </p>

        <form className="tv-search-form" onSubmit={handleSearch}>
          <div style={{ padding: '0 10px', color: '#9ca3af', flexShrink: 0 }}>
            <Search size={18} />
          </div>
          <input
            className="tv-search-input"
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Ej: T1234 o TAM-XYZ"
          />
          <button className="tv-search-btn" type="submit">BUSCAR</button>
        </form>
      </div>

      <div style={{ minHeight: '300px' }}>
        <AnimatePresence mode="wait">

          {/* Loading */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '60px' }}
            >
              <div style={{
                width: '40px', height: '40px', border: '3px solid #f3f4f6',
                borderTopColor: C.electric, borderRadius: '50%', animation: 'spin 1s linear infinite'
              }} />
              <p style={{ color: C.textMuted, marginTop: '16px', fontWeight: '500', fontSize: '0.9rem' }}>Localizando paquete...</p>
            </motion.div>
          )}

          {/* Error */}
          {error && !loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              style={{ padding: '24px 16px', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '16px', textAlign: 'center' }}
            >
              <AlertCircle size={32} color={C.electric} style={{ marginBottom: '12px' }} />
              <h3 style={{ color: '#991b1b', marginBottom: '6px', fontWeight: '700', fontSize: '1rem' }}>No se pudo encontrar</h3>
              <p style={{ color: '#b91c1c', fontSize: '0.85rem', wordBreak: 'break-word' }}>{error}</p>
            </motion.div>
          )}

          {/* Data */}
          {data && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              {/* Main Info Card */}
              <div className="tv-card">

                {/* Header: ID + ETA | Status badge */}
                <div className="tv-header-row">
                  <div className="tv-id-eta-wrap">
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: '0.65rem', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700', margin: '0 0 2px' }}>ID de Tracking</p>
                      <h3 className="tv-tracking-id">{data.id}</h3>
                    </div>
                    {data.eta && (
                      <div className="tv-eta-block">
                        <p style={{ fontSize: '0.65rem', color: C.electric, textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '800', margin: '0 0 2px' }}>ETA / Llegada Estimada</p>
                        <h3 style={{ fontSize: '1.05rem', color: C.text, margin: 0, fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Clock size={15} color={C.electric} /> {data.eta}
                        </h3>
                      </div>
                    )}
                  </div>

                  <div className="tv-status-badge">
                    <CheckCircle2 size={13} /> {data.status?.toUpperCase()}
                  </div>
                </div>

                {/* Shipping Marks */}
                {data.shipping_marks && (
                  <div style={{ marginBottom: '18px', padding: '12px 14px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <p style={{ fontSize: '0.6rem', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '800', margin: '0 0 4px' }}>Marcas de Embarque / Shipping Marks</p>
                    <p style={{ margin: 0, fontWeight: '700', color: C.text, fontSize: '0.9rem', wordBreak: 'break-word' }}>{data.shipping_marks}</p>
                  </div>
                )}

                {/* Metrics grid */}
                <div className="tv-metrics-grid">
                  <div>
                    <p style={{ fontSize: '0.6rem', color: C.textMuted, textTransform: 'uppercase', fontWeight: '700', margin: '0 0 3px' }}>Medio</p>
                    <p style={{ color: C.text, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', margin: 0, fontWeight: '500' }}>
                      {data.transport_type === 'air' ? <Plane size={14} color={C.electric} /> : data.transport_type === 'sea' ? <Ship size={12} color={C.electric} /> : <Truck size={12} color={C.electric} />}
                      {data.transport_type === 'air' ? 'Aéreo' : data.transport_type === 'sea' ? 'Marítimo' : 'Terrestre'}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.6rem', color: C.textMuted, textTransform: 'uppercase', fontWeight: '700', margin: '0 0 3px' }}>Destino Final</p>
                    <p style={{ color: C.text, fontSize: '0.85rem', margin: 0, fontWeight: '500' }}>{data.destination || 'Por definir'}</p>
                  </div>
                </div>
              </div>

              {/* History Section */}
              <div className="tv-history-card">
                <h4 style={{ color: C.text, fontSize: '0.95rem', fontWeight: '800', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={15} color={C.electric} /> Historial Detallado
                </h4>

                <div className="tv-timeline-wrap">
                  <div className="tv-timeline-line" />
                  <div className="tv-timeline-steps">
                    {data.steps?.map((step, index) => (
                      <div key={index} className="tv-step">
                        <div className="tv-step-dot" style={{ background: index === 0 ? C.electric : '#d1d5db' }} />
                        <p className={`tv-step-desc${index === 0 ? ' active' : ''}`}>{step.desc}</p>
                        <div className="tv-step-meta">
                          {step.desc !== 'En Tránsito Internacional' && (
                            <span><MapPin size={10} /> {step.location}</span>
                          )}
                          <span><Clock size={10} /> {step.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Empty state */}
          {!data && !loading && !error && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 16px', border: '2px dashed #f3f4f6', borderRadius: '20px' }}
            >
              <div style={{ width: '56px', height: '56px', background: '#f9fafb', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Package size={26} color="#d1d5db" />
              </div>
              <h3 style={{ color: C.text, fontWeight: '700', margin: '0 0 6px', fontSize: '1rem', textAlign: 'center' }}>Paquete no seleccionado</h3>
              <p style={{ color: C.textMuted, textAlign: 'center', fontSize: '0.8rem', maxWidth: '240px', margin: 0 }}>
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
