const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config(); // Carga las variables de entorno desde el archivo .env

const app = express();
const port = 3000;

// Configuración de CORS para permitir solicitudes desde el frontend
app.use(cors());

app.use(cors({ origin: "http://localhost:5500" })); // Cambia la URL al dominio de tu frontend si es diferente
app.use(bodyParser.json());

// Ruta para enviar el correo
app.post("/send-email", async (req, res) => {
  const { name, email, message } = req.body;

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
