const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const path = require('path');

// 1) Inicializa Firebase Admin
const serviceAccount = require('./messenging-de-firebase-adminsdk-fbsvc-3103f6c3a6.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();

// 2) Servir archivos estáticos desde /public
app.use(express.static(path.join(__dirname, 'public')));

// 3) Parsear formularios
app.use(bodyParser.urlencoded({ extended: true }));

// 4) Endpoint para enviar la notificación
app.post('/send', async (req, res) => {
  const { token, title, body } = req.body;
  try {
    const message = {
      token,
      android: {
        priority: 'high'
      },
      data: { title, body }
    };
    console.log('→ PAYLOAD SALIENTE DEL SERVIDOR:\n', JSON.stringify(message, null, 2));
    const response = await admin.messaging().send(message);
    res.send(`✅ Notificación enviada (ID: ${response})`);
  } catch (err) {
    console.error(err);
    res.status(500).send(`❌ Error: ${err}`);
  }
});

// 5) Arranca el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
