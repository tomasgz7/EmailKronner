const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config(); // Carga las variables de entorno desde el archivo .env

const app = express();
const port = 3000;

// Definir los orígenes permitidos
const allowedOrigins = ["http://localhost:5500", "http://127.0.0.1:5500"];

app.use(
  cors({
    origin: function (origin, callback) {
      // Permitir el origen si está en la lista de permitidos o si no hay origen (solicitudes de herramientas como Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("No permitido por CORS"));
      }
    },
  })
);

app.use(bodyParser.json());

// Ruta para enviar el correo
app.post("/send-email", async (req, res) => {
  const { name, email, phone, message } = req.body;

  // Configuración del transportador de Nodemailer
  let transporter = nodemailer.createTransport({
    service: "gmail", // Usamos el servicio de Gmail
    auth: {
      user: process.env.EMAIL_USER, // Correo desde las variables de entorno
      pass: process.env.EMAIL_PASS, // Contraseña o contraseña de aplicación desde las variables de entorno
    },
    tls: {
      rejectUnauthorized: false, // Permitir certificados no verificados
    },
  });

  // Configuración del correo a enviar
  let mailOptions = {
    from: `<${process.env.EMAIL_USER}>`, // Correo del remitente
    to: "elocomy98@gmail.com", // Dirección de correo del destinatario
    subject: `Nuevo mensaje de ${name}`, // Asunto del correo
    text: `Has recibido un nuevo mensaje de contacto.\n
        Nombre: ${name}\n
        Correo: ${email}\n
        Telefono: ${phone}\n
        Mensaje:\n
        ${message}\n
    `,
  };

  try {
    // Enviar el correo
    let info = await transporter.sendMail(mailOptions);
    console.log("Correo enviado: %s", info.messageId);
    res.status(200).send({ message: "Correo enviado con éxito" });
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    res.status(500).send({ message: "Error al enviar el correo" });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(
    `Servidor de envío de correos escuchando en http://localhost:${port}`
  );
});
