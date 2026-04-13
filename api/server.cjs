const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de SMTP
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT == 465, // true para puerto 465, false para otros
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// API para chequear salud
app.get('/api/health', (req, res) => {
    res.json({ status: "ok", service: "TAM Cargo API" });
});

// Endpoint para enviar correos de ingreso de carga (mercurio recibida)
app.post('/api/send-receipt', async (req, res) => {
    const { to, clientName, shippingMarks, description, pieces, weight, volume, tracking } = req.body;

    if (!to || !clientName) {
        return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const mailOptions = {
        from: process.env.SMTP_FROM,
        to: to,
        subject: `Confirmación de Recepción Almacén - ${shippingMarks || clientName}`,
        html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 16px; color: #1f2937;">
                <div style="text-align: center; margin-bottom: 24px;">
                    <div style="display: inline-block; background: #B11E22; color: white; padding: 10px 20px; border-radius: 8px; font-weight: bold; font-size: 14px;">TAM CARGO LOGISTICS</div>
                </div>
                
                <h2 style="color: #111827; margin-bottom: 8px; text-align: center;">📦 ¡Carga Recibida con Éxito!</h2>
                <p style="text-align: center; color: #6b7280; margin-bottom: 32px;">Hola <strong>${clientName}</strong>, confirmamos que su mercancía ya se encuentra en nuestras manos.</p>
                
                <div style="background: #f9fafb; border: 1px solid #f3f4f6; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Shipping Mark:</td>
                            <td style="padding: 8px 0; color: #111827; font-weight: bold; text-align: right;">${shippingMarks || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Descripción:</td>
                            <td style="padding: 8px 0; color: #111827; text-align: right;">${description || 'Sin descripción'}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Tracking Courier:</td>
                            <td style="padding: 8px 0; color: #B11E22; font-weight: 600; text-align: right;">${tracking || 'No especificado'}</td>
                        </tr>
                    </table>
                    
                    <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between;">
                        <div style="text-align: center; flex: 1;">
                            <div style="font-size: 11px; color: #6b7280; text-transform: uppercase;">Piezas</div>
                            <div style="font-size: 16px; font-weight: 800; color: #111827;">${pieces || 1}</div>
                        </div>
                        <div style="text-align: center; flex: 1; border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb;">
                            <div style="font-size: 11px; color: #6b7280; text-transform: uppercase;">Peso</div>
                            <div style="font-size: 16px; font-weight: 800; color: #111827;">${weight || 0} Kg</div>
                        </div>
                        <div style="text-align: center; flex: 1;">
                            <div style="font-size: 11px; color: #6b7280; text-transform: uppercase;">Volumen</div>
                            <div style="font-size: 16px; font-weight: 800; color: #111827;">${volume || 0} CBM</div>
                        </div>
                    </div>
                </div>
                
                <p style="font-size: 14px; line-height: 1.5; color: #4b5563;">
                    Su carga será procesada para el próximo despacho disponible. Recibirá una nueva notificación cuando se encuentre en tránsito hacia su destino.
                </p>
                
                <div style="margin-top: 40px; border-top: 1px solid #f3f4f6; padding-top: 20px; text-align: center; font-size: 12px; color: #9ca3af;">
                    <strong>TAM Cargo Logistics</strong><br>
                    Expertos en logística internacional.<br>
                    <em>Este es un correo automático, por favor no responda.</em>
                </div>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: "Notificación de ingreso enviada" });
    } catch (error) {
        console.error("Error SMTP Ingreso:", error);
        res.status(500).json({ error: "No se pudo enviar la notificación", details: error.message });
    }
});

// Endpoint para enviar correos de tracking
app.post('/api/send-email', async (req, res) => {
    const { to, clientName, trackingId, shippingMarks } = req.body;

    if (!to || !trackingId) {
        return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const mailOptions = {
        from: process.env.SMTP_FROM,
        to: to,
        subject: `Seguimiento TAM Cargo - Guía ${trackingId}`,
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #B11E22;">Hola ${clientName},</h2>
                <p>Le enviamos los datos actualizados para el rastreo de su carga:</p>
                <div style="background: #f9f9f9; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px dashed #B11E22; text-align: center;">
                    <p style="margin: 0 0 10px 0; font-size: 0.9em; color: #666;">Número de Tracking:</p>
                    <div style="font-family: monospace; font-size: 24px; color: #B11E22; font-weight: bold; letter-spacing: 2px;">${trackingId}</div>
                    <p style="margin: 15px 0 5px 0; font-size: 0.8em; color: #666;"><strong>🏷️ Marcas de Embarque:</strong> ${shippingMarks || 'N/A'}</p>
                </div>
                <p>Para ver el estatus sin tener que copiar el código, haga clic aquí:</p>
                <a href="${req.headers.origin || 'https://tam-cargo.com'}/?t=${trackingId}" 
                   style="display: inline-block; background: #B11E22; color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                   VER ESTATUS DEL ENVÍO
                </a>
                <p style="margin-top: 30px; font-size: 0.8em; color: #777;">
                    Gracias por confiar en <strong>TAM Cargo Logistics</strong>.<br>
                    Este es un correo automático, por favor no responda a este mensaje.
                </p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: "Correo enviado correctamente" });
    } catch (error) {
        console.error("Error SMTP:", error);
        res.status(500).json({ error: "Error al enviar el correo", details: error.message });
    }
});

// Para despliegue en Vercel como Serverless Function
module.exports = app;

const PORT = process.env.PORT || 3001;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`API de TAM Cargo corriendo en el puerto ${PORT}`);
    });
}