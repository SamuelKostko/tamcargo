const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// API simple para cotizaciones y chequeo de salud del backend
app.get('/api/health', (req, res) => {
    res.json({ status: "ok", service: "TAM Cargo API" });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`API de TAM Cargo corriendo en el puerto ${PORT}`);
});