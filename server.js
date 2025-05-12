//Servidor Node.js para enviar notificaciones push usando Firebase Admin SDK
//Con credenciales del Service Account y un formulario web simple
const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const path = require('path');

//Iniciar Firebase Admin con las credenciales del JSON proporcionado
const serviceAccount = require('./messenging-de-firebase-adminsdk-fbsvc-3103f6c3a6.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

//Crear la aplicacion Express
const app = express();

//Permitir acceso a los archivos estaticos (HTML, CSS, JS) en la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

//Configurar lectura de datos enviados desde formularios HTML
app.use(bodyParser.urlencoded({ extended: true }));

//Punto de recepcion POST '/send' desde el formulario
//Recibe token del dispositivo, titulo y cuerpo del mensaje
app.post('/send', async (req, res) => {
  const { token, title, body } = req.body;
  try {
    //Armar el mensaje siguiendo la estructura de Firebase Cloud Messaging
    const message = {
      token,            //dispositivo destino
      android: {        //opciones para Android (prioridad alta)
        priority: 'high'
      },
      data: {           //datos que el cliente recibira en msg.data
        title,          //texto para el titulo de la notificacion
        body            //texto para el cuerpo de la notificacion
      }
    };

    //Mostrar en la consola el mensaje tal como se enviara
    console.log('→ Enviando notificacion:', JSON.stringify(message, null, 2));

    //Enviar notificacion llamando a Firebase Admin SDK
    const response = await admin.messaging().send(message);

    //Responder al navegador que se envio correctamente, con el ID de mensaje
    res.send(`✅ Notificacion enviada correctamente (ID: ${response})`);
  } catch (err) {
    //En caso de error, mostrar en consola y responder con codigo 500
    console.error('Error al enviar notificacion:', err);
    res.status(500).send(`❌ No se pudo enviar la notificacion: ${err}`);
  }
});

//Iniciar el servidor en el puerto 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => 
  console.log(`Servidor escuchando en http://localhost:${PORT}`)
);
