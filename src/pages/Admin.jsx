import React, { useState, useEffect } from 'react';
import Logo from '../assets/TAM CARGO.png';
import {
  Plus,
  Package,
  Settings,
  LogOut,
  Search,
  Edit3,
  Trash2,
  ChevronRight,
  TrendingUp,
  Database,
  ArrowLeft,
  X,
  Save,
  Clock,
  MapPin,
  Truck,
  Ship,
  Mail,
  Box,
  AlertCircle,
  FileText,
  LayoutGrid,
  User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';

const C = {
  electric: "#B11E22",
  electricGrad: "linear-gradient(135deg, #B11E22 0%, #D32F2F 100%)",
  dark: "#0f172a",
  glass: "rgba(255, 255, 255, 0.7)",
  text: "#1e293b",
  textMuted: "#64748b",
  border: "#e2e8f0",
  bgSubtle: "#f8fafc",
  cardShadow: "0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.05)",
  activeBg: "rgba(177, 30, 34, 0.08)"
};

const fontStyles = {
  fontFamily: "'Plus Jakarta Sans', sans-serif"
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('shipments'); // 'shipments' or 'bls'
  const [shipments, setShipments] = useState([]);
  const [bls, setBls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showBlModal, setShowBlModal] = useState(false);
  const [currentShipment, setCurrentShipment] = useState(null);
  const [currentBl, setCurrentBl] = useState(null);
  const [receipts, setReceipts] = useState([]);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [currentReceipt, setCurrentReceipt] = useState(null);
  const [expandedClients, setExpandedClients] = useState({});
  const [pasteMode, setPasteMode] = useState(false);
  const [pastedItems, setPastedItems] = useState([]);
  const [selectedReceiptIds, setSelectedReceiptIds] = useState([]);
  const [selectedClientFilter, setSelectedClientFilter] = useState('');

  const normalize = (name) => name?.trim().toUpperCase() || 'SIN NOMBRE';

  const levenshtein = (a, b) => {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        const cost = b[i - 1] === a[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost);
      }
    }
    return matrix[b.length][a.length];
  };

  const findFuzzyMatch = (name, acc) => {
    const raw = normalize(name);
    const existingKeys = Object.keys(acc);
    const match = existingKeys.find(key => {
      // Si son muy cortos (ej: "Ali"), solo aceptamos error 1. Si son largos, error 2.
      const dist = levenshtein(raw, key);
      const threshold = key.length > 5 ? 2 : 1;
      return dist <= threshold;
    });
    return match || raw;
  };

  const groupedShipments = shipments.reduce((acc, s) => {
    const name = findFuzzyMatch(s.client_name, acc);
    if (!acc[name]) acc[name] = [];
    acc[name].push(s);
    return acc;
  }, {});

  const groupedReceipts = receipts.filter(r => r.status !== 'shipped').reduce((acc, r) => {
    const name = findFuzzyMatch(r.client_name, acc);
    if (!acc[name]) acc[name] = [];
    acc[name].push(r);
    return acc;
  }, {});

  const pendingClients = Object.keys(groupedReceipts).sort();

  // For expansion, we need to find which fuzzy group the name belongs to
  const toggleClient = (name) => {
    // Check shipments then receipts to find the actual group key being used
    const allGroups = { ...groupedShipments, ...groupedReceipts };
    const key = findFuzzyMatch(name, allGroups);
    setExpandedClients(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Real-time Subscriptions
  useEffect(() => {
    const isAuth = localStorage.getItem('isAuth');
    if (!isAuth) {
      navigate('/login');
      return;
    }

    setLoading(true);

    // Listen to Shipments
    const qShipments = query(collection(db, 'tracking'), orderBy('last_update', 'desc'));
    const unsubShipments = onSnapshot(qShipments, (snap) => {
      setShipments(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    // Listen to BLs
    const qBls = query(collection(db, 'containers'), orderBy('last_update', 'desc'));
    const unsubBls = onSnapshot(qBls, (snap) => {
      setBls(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Listen to Receipts
    const qReceipts = query(collection(db, 'receipts'), orderBy('created_at', 'desc'));
    const unsubReceipts = onSnapshot(qReceipts, (snap) => {
      setReceipts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubShipments();
      unsubBls();
      unsubReceipts();
    };
  }, [navigate]);

  const handleDelete = async (coll, id) => {
    if (window.confirm('¿Está seguro de eliminar?')) {
      try {
        await deleteDoc(doc(db, coll, id));
      } catch (error) {
        alert("Error al eliminar: " + error.message);
      }
    }
  };

  const handleSaveShipment = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const id = currentShipment ? currentShipment.id : formData.get('trackingId');

    if (!id) {
      alert("Error: No se pudo obtener el ID de la guía");
      return;
    }

    const marksStr = formData.get('shipping_marks') || '';
    const marksArray = marksStr.split(',').map(m => m.trim().toUpperCase()).filter(m => m !== '');

    const data = {
      client_name: formData.get('client_name'),
      shipping_marks: marksStr,
      shipping_marks_array: marksArray,
      container_id: formData.get('bl_id') || null,
      last_update: serverTimestamp()
    };

    try {
      await setDoc(doc(db, 'tracking', id), data, { merge: true });

      // Mark receipts as shipped
      if (selectedReceiptIds.length > 0) {
        const batchPromise = selectedReceiptIds.map(rid =>
          setDoc(doc(db, 'receipts', rid), { status: 'shipped', tracking_id: id }, { merge: true })
        );
        await Promise.all(batchPromise);
      }

      setShowModal(false);
      setSelectedReceiptIds([]);
      setSelectedClientFilter('');
    } catch (error) {
      alert("Error al guardar guía: " + error.message);
    }
  };

  const handlePaste = (e) => {
    const text = e.target.value;
    if (!text.trim() || !text.includes('\t')) return;

    const rows = text.split('\n').filter(r => r.trim() !== '');
    let lastClient = '';
    let lastMarks = '';

    const parsed = rows.map(r => {
      const c = r.split('\t');

      const currentMarks = (c[0] || '').trim();
      const currentClient = (c[3] || '').trim();

      const finalMarks = currentMarks || lastMarks;
      const finalClient = currentClient || lastClient;

      if (currentMarks) lastMarks = currentMarks;
      if (currentClient) lastClient = currentClient;

      return {
        id: `REC-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        shipping_marks: finalMarks,
        client_name: finalClient,
        description: (c[4] || '').trim(),
        pieces: (c[6] || '1').trim(),
        weight: (c[8] || '0').trim(),
        volume: (c[13] || '0').trim(),
        courier_tracking: (c[14] || '').trim(),
        created_at: new Date()
      };
    });
    setPastedItems(parsed);
  };

  const updatePastedItem = (index, field, value) => {
    const newItems = [...pastedItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setPastedItems(newItems);
  };

  const removePastedItem = (index) => {
    setPastedItems(pastedItems.filter((_, i) => i !== index));
  };

  const handleSaveBulkReceipts = async () => {
    if (pastedItems.length === 0) return;

    setLoading(true);
    try {
      for (const item of pastedItems) {
        await setDoc(doc(db, 'receipts', item.id), {
          ...item,
          created_at: serverTimestamp()
        });
      }
      setPastedItems([]);
      setPasteMode(false);
      setShowReceiptModal(false);
    } catch (error) {
      alert("Error en carga masiva: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveReceipt = async (e) => {
    e.preventDefault();
    if (pasteMode) {
      await handleSaveBulkReceipts();
      return;
    }

    const formData = new FormData(e.target);
    const id = currentReceipt ? currentReceipt.id : `REC-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const email = formData.get('email');
    const clientName = formData.get('client_name');
    const shippingMarks = formData.get('shipping_marks');

    const data = {
      client_name: clientName,
      email: email || '',
      shipping_marks: shippingMarks,
      description: formData.get('description') || '',
      pieces: formData.get('pieces') || '1',
      weight: formData.get('weight') || '0',
      volume: formData.get('volume') || '0',
      courier_tracking: formData.get('tracking') || '',
      created_at: currentReceipt ? currentReceipt.created_at : serverTimestamp()
    };

    try {
      await setDoc(doc(db, 'receipts', id), data, { merge: true });

      // Send Receipt Email
      if (email && email.trim() && !currentReceipt) {
        try {
          await fetch('/api/send-receipt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: email,
              clientName,
              shippingMarks,
              description: data.description,
              pieces: data.pieces,
              weight: data.weight,
              volume: data.volume,
              tracking: data.courier_tracking
            })
          });
        } catch (err) { console.error("Error al enviar email ingreso:", err); }
      }

      setShowReceiptModal(false);
    } catch (error) {
      alert("Error al guardar ingreso: " + error.message);
    }
  };

  const handleSaveBl = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // Si estamos editando, usamos currentBl.id ya que el input está disabled y no sale en FormData
    const id = currentBl ? currentBl.id : formData.get('blId');
    const newStatus = formData.get('status');
    const newLocation = formData.get('location');

    if (!id) {
      alert("Error: No se pudo obtener el ID del BL");
      return;
    }

    // Logic to append to timeline if status changed
    let updatedSteps = currentBl?.steps || [];
    const isNewStatus = !currentBl || currentBl.status !== newStatus;

    if (isNewStatus) {
      updatedSteps = [
        {
          desc: newStatus,
          location: newLocation,
          date: new Date().toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
        },
        ...updatedSteps
      ];
    }

    const data = {
      status: newStatus,
      transport_type: formData.get('transport_type'),
      location: newLocation,
      destination: formData.get('destination') || 'Venezuela',
      eta: formData.get('eta') || '',
      last_update: serverTimestamp(),
      steps: updatedSteps
    };

    try {
      await setDoc(doc(db, 'containers', id), data, { merge: true });
      setShowBlModal(false);
    } catch (error) {
      alert("Error al guardar BL: " + error.message);
    }
  };

  const handleSendEmail = async (s) => {
    const email = window.prompt(`Enviar tracking a ${s.client_name}\nIngrese el correo:`, "");
    if (email && email.trim()) {
      try {
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: email,
            clientName: s.client_name,
            trackingId: s.id,
            shippingMarks: s.shipping_marks
          })
        });

        const result = await response.json();
        if (result.success) {
          alert("¡Correo enviado con éxito!");
        } else {
          alert("Error al enviar: " + (result.error || "Error desconocido"));
        }
      } catch (error) {
        console.error("Error al conectar con la API:", error);
        alert("No se pudo conectar con el servidor de correos. Verifique que el backend esté corriendo.");
      }
    }
  };

  const handleSendReceiptEmail = async (r) => {
    const email = window.prompt(`Enviar recibo de ingreso a ${r.client_name}\nIngrese el correo:`, r.email || "");
    if (email && email.trim()) {
      try {
        const response = await fetch('/api/send-receipt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: email,
            clientName: r.client_name,
            shippingMarks: r.shipping_marks,
            description: r.description,
            pieces: r.pieces,
            weight: r.weight,
            volume: r.volume,
            tracking: r.courier_tracking
          })
        });

        const result = await response.json();
        if (result.success) {
          alert("¡Correo de ingreso enviado con éxito!");
        } else {
          alert("Error al enviar: " + (result.error || "Error desconocido"));
        }
      } catch (error) {
        console.error("Error al conectar con la API:", error);
        alert("No se pudo conectar con el servidor de correos.");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuth');
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', ...fontStyles }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Sidebar - Premium Dark */}
      <aside style={{
        width: '280px', height: '100vh', position: 'fixed', left: 0, top: 0,
        background: C.dark, color: '#fff', padding: '32px 24px', display: 'flex', flexDirection: 'column',
        boxShadow: '4px 0 24px rgba(0,0,0,0.1)', zIndex: 50
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '48px', padding: '0 8px' }}>
          <img src={Logo} alt="TAM Cargo" style={{ height: '40px', objectFit: 'contain', alignSelf: 'center' }} />
          <span style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '2px', marginLeft: '4px' }}>Perfil Administrador</span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <SidebarItem
            icon={<LayoutGrid size={20} />}
            label="Ingresos Almacén"
            active={activeTab === 'receipts'}
            onClick={() => setActiveTab('receipts')}
          />
          <SidebarItem
            icon={<TrendingUp size={20} />}
            label="Guías Despacho"
            active={activeTab === 'shipments'}
            onClick={() => setActiveTab('shipments')}
          />
          <SidebarItem
            icon={<Ship size={20} />}
            label="Consolidados"
            active={activeTab === 'bls'}
            onClick={() => setActiveTab('bls')}
          />
        </nav>

        <button
          style={{
            marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '12px',
            padding: '14px 20px', borderRadius: '14px', border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.05)',
            color: '#f87171', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem', transition: 'all 0.2s'
          }}
          onClick={handleLogout}
        >
          <LogOut size={18} /> Cerrar Sesión
        </button>
      </aside>

      {/* Main Content */}
      <main style={{
        flex: 1, marginLeft: '280px', padding: '48px 64px', minHeight: '100vh', color: C.text,
        background: 'radial-gradient(circle at 0% 0%, #fff 0%, #f1f5f9 100%)'
      }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '48px' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: C.electric, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>Security & Logistics Control</div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, margin: 0, letterSpacing: '-1px' }}>
              {activeTab === 'receipts' ? 'Ingresos Almacén' : activeTab === 'shipments' ? 'Guías de Despacho' : 'Consolidados Carga'}
            </h1>
            <p style={{ color: C.textMuted, marginTop: '8px', fontSize: '1rem' }}>
              {activeTab === 'receipts'
                ? 'Gestione la entrada de carga y el inventario diario.'
                : activeTab === 'shipments' ? 'Rastreo dinámico de guías individuales.' : 'Estatus centralizado de contenedores internacionales.'}
            </p>
          </div>
          <button
            onClick={() => {
              if (activeTab === 'receipts') { setCurrentReceipt(null); setShowReceiptModal(true); }
              else if (activeTab === 'shipments') {
                setCurrentShipment(null);
                setSelectedReceiptIds([]);
                setSelectedClientFilter('');
                setShowModal(Date.now());
              }
              else { setCurrentBl(null); setShowBlModal(true); }
            }}
            style={{
              background: C.electricGrad, color: '#fff', border: 'none', borderRadius: '16px',
              padding: '16px 32px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px',
              cursor: 'pointer', boxShadow: '0 10px 20px rgba(177,30,34,0.3)', transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Plus size={22} /> NUEVO {activeTab === 'receipts' ? 'INGRESO' : activeTab === 'shipments' ? 'TRACKING' : 'BL'}
          </button>
        </header>

        {/* Quick Stats Overview */}
        {!loading && (
          <div style={{ display: 'flex', gap: '24px', marginBottom: '40px' }}>
            <StatCard label="Guías Activas" value={shipments.length} icon={<Package size={20} />} trend="En tránsito internacional" />
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px', color: C.textMuted }}>
            <div style={{ marginBottom: '20px' }}>Sincronizando con base de datos...</div>
          </div>
        ) : activeTab === 'receipts' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {Object.entries(groupedReceipts).sort().map(([clientName, clientReceipts]) => (
              <div key={clientName} style={{ background: '#fff', borderRadius: '24px', border: `1px solid ${C.border}`, overflow: 'hidden', boxShadow: C.cardShadow }}>
                <div
                  onClick={() => toggleClient(clientName)}
                  style={{
                    padding: '24px 32px', background: expandedClients[clientName] ? 'rgba(0,0,0,0.02)' : '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', background: `${C.electric}10`, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.electric }}>
                      <User size={20} />
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: C.text }}>{clientName}</h4>
                      <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: C.textMuted, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} /> {clientReceipts.length} registros
                        </span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: C.electric }}>
                          {clientReceipts.reduce((sum, r) => sum + parseFloat(r.weight || 0), 0).toFixed(1)} Kg de peso
                        </span>
                      </div>
                    </div>
                  </div>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: C.bgSubtle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {expandedClients[clientName] ? <X size={16} /> : <ChevronRight size={16} />}
                  </div>
                </div>

                {expandedClients[clientName] && (
                  <div style={{ borderTop: `1px solid ${C.border}`, background: '#fdfdfd', padding: '12px' }}>
                    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                      <thead>
                        <tr style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: C.textMuted, letterSpacing: '1px' }}>
                          <th style={{ padding: '8px 20px', textAlign: 'left' }}>Identificador</th>
                          <th style={{ padding: '8px 20px', textAlign: 'left' }}>Detalle Carga</th>
                          <th style={{ padding: '8px 20px', textAlign: 'center' }}>Métricas Almacén</th>
                          <th style={{ padding: '8px 20px', textAlign: 'right' }}>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clientReceipts.sort((a, b) => b.created_at - a.created_at).map(r => (
                          <tr key={r.id} style={{ background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                            <td style={{ padding: '16px 20px', borderRadius: '12px 0 0 12px', borderLeft: `4px solid ${C.electric}` }}>
                              <div style={{ fontWeight: 800, fontSize: '0.9rem', color: C.electric }}>{r.shipping_marks}</div>
                              <div style={{ fontSize: '0.65rem', color: C.textMuted, marginTop: '2px' }}>ID: {r.id}</div>
                            </td>
                            <td style={{ padding: '16px 20px' }}>
                              <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{r.description || 'N/A'}</div>
                              <div style={{ fontSize: '0.7rem', color: C.textMuted, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Truck size={10} /> {r.courier_tracking || 'Pendiente tracking'}
                              </div>
                            </td>
                            <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                <span style={{ padding: '4px 8px', borderRadius: '6px', background: '#f1f5f9', fontSize: '0.75rem', fontWeight: 700 }}>{r.pieces} pcs</span>
                                <span style={{ padding: '4px 8px', borderRadius: '6px', background: '#ecfdf5', fontSize: '0.75rem', fontWeight: 700, color: '#059669' }}>{r.weight}kg</span>
                              </div>
                            </td>
                            <td style={{ padding: '16px 20px', borderRadius: '0 12px 12px 0', textAlign: 'right' }}>
                              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <IconButton icon={<Mail size={16} />} color={C.electric} onClick={() => handleSendReceiptEmail(r)} tooltip="Mandar por correo" />
                                <IconButton icon={<Edit3 size={16} />} color="#6366f1" onClick={() => { setCurrentReceipt(r); setShowReceiptModal(true); setPasteMode(false); }} tooltip="Editar ingreso" />
                                <IconButton icon={<Trash2 size={16} />} color="#ef4444" onClick={() => handleDelete('receipts', r.id)} tooltip="Eliminar" />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : activeTab === 'shipments' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {Object.entries(groupedShipments).sort().map(([clientName, guides]) => (
              <div key={clientName} style={{ background: '#fff', borderRadius: '16px', border: `1px solid ${C.border}`, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                <div
                  onClick={() => toggleClient(clientName)}
                  style={{
                    padding: '16px 24px', background: expandedClients[clientName] ? '#f9fafb' : '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', background: `${C.electric}10`, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.electric }}>
                      <Package size={16} />
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>{clientName}</h4>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: C.textMuted }}>{guides.length} {guides.length === 1 ? 'guía registrada' : 'guías registradas'}</p>
                    </div>
                  </div>
                  {expandedClients[clientName] ? <X size={18} color={C.textMuted} /> : <ChevronRight size={18} color={C.textMuted} />}
                </div>

                {expandedClients[clientName] && (
                  <div style={{ borderTop: `1px solid ${C.border}`, background: '#fff' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: '#fdfdfd', fontSize: '0.65rem', textTransform: 'uppercase', color: C.textMuted, borderBottom: `1px solid ${C.border}` }}>
                          <th style={{ padding: '12px 24px', textAlign: 'left' }}>Guía ID / Tracking</th>
                          <th style={{ padding: '12px 24px', textAlign: 'left' }}>Master BL</th>
                          <th style={{ padding: '12px 24px', textAlign: 'right' }}>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {guides.map(s => (
                          <tr key={s.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                            <td style={{ padding: '16px 24px' }}>
                              <div style={{ fontWeight: 800, color: C.electric, fontSize: '0.9rem' }}>{s.id}</div>
                              {s.shipping_marks && <div style={{ fontSize: '0.7rem', color: C.textMuted, marginTop: '2px' }}>Marks: {s.shipping_marks}</div>}
                            </td>
                            <td style={{ padding: '16px 24px' }}>
                              {s.container_id ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                                  <span style={{ fontWeight: 700, color: '#4f46e5' }}>#{s.container_id}</span>
                                  <span style={{ fontSize: '0.7rem', color: C.textMuted }}>({bls.find(b => b.id === s.container_id)?.status || 'Pendiente'})</span>
                                </div>
                              ) : <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>Carga Suelta</span>}
                            </td>
                            <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                              <button onClick={() => handleSendEmail(s)} style={{ background: 'transparent', border: 'none', color: '#10b981', cursor: 'pointer', marginRight: '12px' }} title="Enviar Email"><Mail size={16} /></button>
                              <button onClick={() => { setCurrentShipment(s); setShowModal(true); }} style={{ background: 'transparent', border: 'none', color: '#6366f1', cursor: 'pointer', marginRight: '12px' }} title="Editar"><Edit3 size={16} /></button>
                              <button onClick={() => handleDelete('tracking', s.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }} title="Eliminar"><Trash2 size={16} /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <section style={{ background: '#fff', borderRadius: '20px', border: `1px solid ${C.border}`, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${C.border}` }}>
              <h3 style={{ margin: 0 }}>Consolidados Maestros ({bls.length})</h3>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb', fontSize: '0.75rem', textTransform: 'uppercase', color: C.textMuted }}>
                  <th style={{ padding: '16px 24px', textAlign: 'left' }}>BL ID</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left' }}>Estado General</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left' }}>Ubicación</th>
                  <th style={{ padding: '16px 24px', textAlign: 'center' }}>Llegada (ETA)</th>
                  <th style={{ padding: '16px 24px', textAlign: 'right' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {bls.map(b => (
                  <tr key={b.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: '20px 24px', fontWeight: 800 }}>{b.id}</td>
                    <td style={{ padding: '20px 24px' }}>
                      <span style={{ padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 800, background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' }}>{b.status}</span>
                    </td>
                    <td style={{ padding: '20px 24px', fontSize: '0.85rem' }}>{b.location}</td>
                    <td style={{ padding: '20px 24px', textAlign: 'center', fontSize: '0.85rem', fontWeight: 700, color: C.electric }}>{b.eta || '—'}</td>
                    <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                      <button onClick={() => { setCurrentBl(b); setShowBlModal(true); }} style={{ background: 'transparent', border: 'none', color: '#6366f1', cursor: 'pointer', marginRight: '16px' }}><Edit3 size={18} /></button>
                      <button onClick={() => handleDelete('containers', b.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </main>

      {/* Shipment Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(17,24,39,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ width: '100%', maxWidth: '480px', background: '#fff', borderRadius: '24px', padding: '32px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <h2 style={{ marginBottom: '24px', fontWeight: 800 }}>{currentShipment ? 'Editar Guía' : 'Nueva Guía'}</h2>
            <form onSubmit={handleSaveShipment} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ fontSize: '0.7rem', fontWeight: 800, color: C.textMuted, display: 'block', marginBottom: '8px' }}>NÚMERO DE TRACKING (AUTO)</label>
                <input
                  name="trackingId"
                  key={currentShipment ? 'edit' : showModal}
                  defaultValue={currentShipment ? currentShipment.id : `TAM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`}
                  required
                  readOnly={!!currentShipment}
                  style={{ width: '100%', padding: '14px', borderRadius: '12px', border: `1px solid ${C.border}`, outline: 'none', background: '#f9fafb', fontWeight: 700, color: C.electric }}
                />
              </div>

              {!currentShipment && (
                <div style={{ padding: '16px', borderRadius: '16px', background: '#f8fafc', border: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <label style={{ fontSize: '0.7rem', fontWeight: 800, color: C.electric, display: 'block' }}>VINCULAR CARGAS RECIBIDAS</label>
                  <select
                    value={selectedClientFilter}
                    onChange={(e) => {
                      setSelectedClientFilter(e.target.value);
                      setSelectedReceiptIds([]);
                    }}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${C.border}`, outline: 'none' }}
                  >
                    <option value="">-- Seleccionar Cliente --</option>
                    {pendingClients.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>

                  {selectedClientFilter && (
                    <div style={{ maxHeight: '150px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {(groupedReceipts[selectedClientFilter] || []).map(r => (
                        <label key={r.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', padding: '8px', background: '#fff', borderRadius: '8px', border: `1px solid ${selectedReceiptIds.includes(r.id) ? C.electric : C.border}`, cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={selectedReceiptIds.includes(r.id)}
                            onChange={(e) => {
                              if (e.target.checked) setSelectedReceiptIds(prev => [...prev, r.id]);
                              else setSelectedReceiptIds(prev => prev.filter(id => id !== r.id));
                            }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, color: C.electric }}>{r.shipping_marks}</div>
                            <div style={{ fontSize: '0.7rem', color: C.textMuted }}>{r.description} ({r.pieces} pcs)</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <input
                name="client_name"
                defaultValue={currentShipment?.client_name || selectedClientFilter}
                placeholder="Nombre completo del cliente"
                required
                style={{ padding: '14px', borderRadius: '12px', border: `1px solid ${C.border}`, outline: 'none' }}
              />

              <textarea
                name="shipping_marks"
                defaultValue={currentShipment?.shipping_marks || (selectedReceiptIds.length > 0 ? (groupedReceipts[selectedClientFilter] || []).filter(r => selectedReceiptIds.includes(r.id)).map(r => r.shipping_marks).join(', ') : '')}
                placeholder="Marcas de Embarque (Shipping Marks)"
                rows={3}
                style={{ padding: '14px', borderRadius: '12px', border: `1px solid ${C.border}`, outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
              />

              <div>
                <label style={{ fontSize: '0.7rem', fontWeight: 800, color: C.textMuted, display: 'block', marginBottom: '8px' }}>ASIGNAR A UN CONSOLIDADO (BL)</label>
                <select name="bl_id" defaultValue={currentShipment?.container_id} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: `1px solid ${C.border}`, background: '#fff', outline: 'none' }}>
                  <option value="">-- Carga Suelta (Sin BL) --</option>
                  {bls.map(b => (
                    <option key={b.id} value={b.id}> {b.id} ({b.status})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: `1px solid ${C.border}`, background: '#fff', fontWeight: 700 }}>Cancelar</button>
                <button type="submit" style={{ flex: 1, padding: '14px', borderRadius: '12px', background: C.electric, color: '#fff', border: 'none', fontWeight: 700 }}>Guardar Guía</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BL Modal */}
      {showBlModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(17,24,39,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ width: '100%', maxWidth: '480px', background: '#fff', borderRadius: '24px', padding: '32px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <h2 style={{ marginBottom: '8px', fontWeight: 800 }}>{currentBl ? 'Actualizar Master BL' : 'Crear Master BL'}</h2>
            <p style={{ color: C.textMuted, fontSize: '0.85rem', marginBottom: '24px' }}>Todos los clientes vinculados verán esta información.</p>

            <form onSubmit={handleSaveBl} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <input name="blId" defaultValue={currentBl?.id} placeholder="ID de BL Maestro" required disabled={!!currentBl} style={{ padding: '14px', borderRadius: '12px', border: `1px solid ${C.border}`, outline: 'none' }} />

              <div>
                <label style={{ fontSize: '0.7rem', fontWeight: 800, color: C.textMuted, display: 'block', marginBottom: '8px' }}>ESTADO DEL CONSOLIDADO</label>
                <select name="status" defaultValue={currentBl?.status} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: `1px solid ${C.border}`, background: '#fff' }}>
                  <option>Recibido en Almacén</option>
                  <option>Cargado en Contenedor / Vehículo</option>
                  <option>En Tránsito Internacional</option>
                  <option>Llegada a Puerto / Aduana</option>
                  <option>Procesando Despacho</option>
                  <option>Disponible para Retiro</option>
                  <option>Entregado / Finalizado</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 800, color: C.textMuted, display: 'block', marginBottom: '8px' }}>TRANSPORTE</label>
                  <select name="transport_type" defaultValue={currentBl?.transport_type} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: `1px solid ${C.border}`, background: '#fff' }}>
                    <option value="air">✈️ Aéreo</option>
                    <option value="sea">🚢 Marítimo</option>
                    <option value="land">🚛 Terrestre</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 800, color: C.textMuted, display: 'block', marginBottom: '8px' }}>UBICACIÓN ACTUAL</label>
                  <input name="location" defaultValue={currentBl?.location || ''} placeholder="Ej: Miami" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: `1px solid ${C.border}`, outline: 'none' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 800, color: C.textMuted, display: 'block', marginBottom: '8px' }}>DESTINO FINAL</label>
                  <input name="destination" defaultValue={currentBl?.destination || 'Venezuela'} placeholder="Ej: Caracas" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: `1px solid ${C.border}`, outline: 'none' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 800, color: C.textMuted, display: 'block', marginBottom: '8px' }}>ETA (LLEGADA ESTIMADA)</label>
                  <input name="eta" defaultValue={currentBl?.eta || ''} placeholder="Ej: 25 de Mayo" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: `1px solid ${C.border}`, outline: 'none' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowBlModal(false)} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: `1px solid ${C.border}`, background: '#fff', fontWeight: 700 }}>Cancelar</button>
                <button type="submit" style={{ flex: 1, padding: '14px', borderRadius: '12px', background: C.electric, color: '#fff', border: 'none', fontWeight: 700 }}>{currentBl ? 'Actualizar y Notificar' : 'Crear BL'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Receipt Modal */}
      {showReceiptModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(17,24,39,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: pasteMode ? '900px' : '480px', background: '#fff', borderRadius: '24px', padding: '32px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', maxHeight: '90vh', overflowY: 'auto', transition: 'max-width 0.3s' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h2 style={{ fontWeight: 800 }}>{currentReceipt ? 'Editar Ingreso' : 'Ingreso de Almacén'}</h2>
              {!currentReceipt && (
                <button
                  onClick={() => { setPasteMode(!pasteMode); setPastedItems([]); }}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '10px', border: `1px solid ${C.border}`, background: pasteMode ? `${C.electric}10` : '#fff', color: pasteMode ? C.electric : C.text, fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}
                >
                  {pasteMode ? <LayoutGrid size={16} /> : <FileText size={16} />}
                  {pasteMode ? 'Cambiar a Manual' : 'Magic Paste (Excel)'}
                </button>
              )}
            </div>

            <p style={{ color: C.textMuted, fontSize: '0.85rem', marginBottom: '24px' }}>
              {pasteMode ? 'Pega las filas directamente desde Excel. Detectaremos los campos automáticamente.' : 'Registre la información básica del ingreso.'}
            </p>

            <form onSubmit={handleSaveReceipt} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {!pasteMode ? (
                <>
                  <input name="client_name" defaultValue={currentReceipt?.client_name} placeholder="Nombre del Cliente" required style={{ padding: '14px', borderRadius: '12px', border: `1px solid ${C.border}`, outline: 'none' }} />
                  <input name="shipping_marks" defaultValue={currentReceipt?.shipping_marks} placeholder="Shipping Mark (T-XXXX)" required style={{ padding: '14px', borderRadius: '12px', border: `1px solid ${C.border}`, outline: 'none' }} />
                  <input name="email" type="email" defaultValue={currentReceipt?.email} placeholder="Correo (Opcional)" style={{ padding: '14px', borderRadius: '12px', border: `1px solid ${C.border}`, outline: 'none' }} />

                  <textarea name="description" defaultValue={currentReceipt?.description} placeholder="Descripción de la carga" rows={2} style={{ padding: '14px', borderRadius: '12px', border: `1px solid ${C.border}`, outline: 'none', resize: 'vertical', fontFamily: 'inherit' }} />

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '0.65rem', fontWeight: 800, color: C.textMuted, marginBottom: '4px', display: 'block' }}>PIEZAS</label>
                      <input name="pieces" type="number" defaultValue={currentReceipt?.pieces || 1} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${C.border}` }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.65rem', fontWeight: 800, color: C.textMuted, marginBottom: '4px', display: 'block' }}>PESO KG</label>
                      <input name="weight" defaultValue={currentReceipt?.weight || 0} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${C.border}` }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.65rem', fontWeight: 800, color: C.textMuted, marginBottom: '4px', display: 'block' }}>VOL CBM</label>
                      <input name="volume" defaultValue={currentReceipt?.volume || 0} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${C.border}` }} />
                    </div>
                  </div>
                  <input name="tracking" defaultValue={currentReceipt?.courier_tracking} placeholder="Tracking Number (Courier)" style={{ padding: '14px', borderRadius: '12px', border: `1px solid ${C.border}`, outline: 'none' }} />
                </>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <textarea
                    onChange={handlePaste}
                    placeholder="Pega aquí las filas de Excel..."
                    rows={6}
                    style={{ width: '100%', padding: '16px', borderRadius: '16px', border: `2px dashed ${C.border}`, background: '#fcfcfc', outline: 'none', fontSize: '0.85rem' }}
                  />

                  {pastedItems.length > 0 && (
                    <div style={{ border: `1px solid ${C.border}`, borderRadius: '12px', overflow: 'hidden' }}>
                      <table style={{ width: '100%', fontSize: '0.75rem', borderCollapse: 'collapse' }}>
                        <thead style={{ background: '#f9fafb' }}>
                          <tr>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Mark</th>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Cliente</th>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Desc</th>
                            <th style={{ padding: '10px', textAlign: 'center' }}>Pzs</th>
                            <th style={{ padding: '10px', textAlign: 'center' }}>Peso (kg)</th>
                            <th style={{ padding: '10px', textAlign: 'center' }}>Vol (cbm)</th>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Tracking</th>
                            <th style={{ padding: '10px' }}></th>
                          </tr>
                        </thead>
                        <tbody>
                          {pastedItems.map((it, idx) => (
                            <tr key={idx} style={{ borderTop: `1px solid ${C.border}` }}>
                              <td style={{ padding: '4px' }}>
                                <input value={it.shipping_marks} onChange={(e) => updatePastedItem(idx, 'shipping_marks', e.target.value)} style={{ width: '100%', border: 'none', padding: '6px', fontSize: '0.75rem', fontWeight: 700 }} />
                              </td>
                              <td style={{ padding: '4px' }}>
                                <input value={it.client_name} onChange={(e) => updatePastedItem(idx, 'client_name', e.target.value)} style={{ width: '100%', border: 'none', padding: '6px', fontSize: '0.75rem' }} />
                              </td>
                              <td style={{ padding: '4px' }}>
                                <input value={it.description} onChange={(e) => updatePastedItem(idx, 'description', e.target.value)} style={{ width: '100%', border: 'none', padding: '6px', fontSize: '0.75rem', color: C.textMuted }} />
                              </td>
                              <td style={{ padding: '4px', textAlign: 'center' }}>
                                <input value={it.pieces} onChange={(e) => updatePastedItem(idx, 'pieces', e.target.value)} style={{ width: '40px', border: 'none', padding: '6px', fontSize: '0.75rem', textAlign: 'center' }} />
                              </td>
                              <td style={{ padding: '4px', textAlign: 'center' }}>
                                <input value={it.weight} onChange={(e) => updatePastedItem(idx, 'weight', e.target.value)} style={{ width: '60px', border: 'none', padding: '6px', fontSize: '0.75rem', textAlign: 'center' }} />
                              </td>
                              <td style={{ padding: '4px', textAlign: 'center' }}>
                                <input value={it.volume} onChange={(e) => updatePastedItem(idx, 'volume', e.target.value)} style={{ width: '60px', border: 'none', padding: '6px', fontSize: '0.75rem', textAlign: 'center' }} />
                              </td>
                              <td style={{ padding: '4px' }}>
                                <input value={it.courier_tracking} onChange={(e) => updatePastedItem(idx, 'courier_tracking', e.target.value)} style={{ width: '100%', border: 'none', padding: '6px', fontSize: '0.75rem' }} />
                              </td>
                              <td style={{ padding: '4px', textAlign: 'center' }}>
                                <button type="button" onClick={() => removePastedItem(idx)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}><X size={14} /></button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowReceiptModal(false)} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: `1px solid ${C.border}`, background: '#fff', fontWeight: 700 }}>Cancelar</button>
                <button
                  type="submit"
                  disabled={pasteMode && pastedItems.length === 0}
                  style={{ flex: 1, padding: '14px', borderRadius: '12px', background: C.electric, color: '#fff', border: 'none', fontWeight: 700, opacity: (pasteMode && pastedItems.length === 0) ? 0.5 : 1 }}
                >
                  {pasteMode ? `Importar ${pastedItems.length} Registros` : 'Guardar Ingreso'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const SidebarItem = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', borderRadius: '14px',
      border: 'none', cursor: 'pointer', transition: 'all 0.2s', width: '100%',
      background: active ? 'rgba(255,255,255,0.1)' : 'transparent',
      color: active ? '#fff' : '#94a3b8',
      fontWeight: active ? 700 : 500,
      position: 'relative',
      textAlign: 'left'
    }}
    onMouseOver={(e) => !active && (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
    onMouseOut={(e) => !active && (e.currentTarget.style.background = 'transparent')}
  >
    {active && <div style={{ position: 'absolute', left: '-12px', top: '25%', bottom: '25%', width: '4px', background: C.electric, borderRadius: '4px', boxShadow: '0 0 10px #B11E22' }} />}
    <span style={{ color: active ? C.electric : 'inherit', display: 'flex' }}>{icon}</span>
    <span style={{ flex: 1 }}>{label}</span>
    {active && <ChevronRight size={14} style={{ opacity: 0.5 }} />}
  </button>
);

const StatCard = ({ label, value, icon, trend }) => (
  <div style={{ background: '#fff', padding: '24px', borderRadius: '24px', boxShadow: C.cardShadow, display: 'flex', flexDirection: 'column', gap: '16px', border: '1px solid rgba(0,0,0,0.03)' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ color: C.textMuted, fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
      <div style={{ color: C.electric, background: `${C.electric}10`, padding: '10px', borderRadius: '12px' }}>{icon}</div>
    </div>
    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: C.text, letterSpacing: '-0.5px' }}>{value}</div>
    <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
      {trend}
    </div>
  </div>
);

const IconButton = ({ icon, color, onClick, tooltip }) => (
  <button
    onClick={onClick}
    title={tooltip}
    style={{
      background: `${color}10`, color: color, border: 'none', borderRadius: '10px',
      padding: '10px', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}
    onMouseOver={(e) => { e.currentTarget.style.background = color; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'scale(1.1)'; }}
    onMouseOut={(e) => { e.currentTarget.style.background = `${color}10`; e.currentTarget.style.color = color; e.currentTarget.style.transform = 'scale(1)'; }}
  >
    {icon}
  </button>
);

export default AdminDashboard;


