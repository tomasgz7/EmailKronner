const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

require("dotenv").config();

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.post("/send-email", async (req, res) => {
  const { name, email, message } = req.body;

  let transporter = nodemailer.createTransport({
    service: "gmail", // Usamos el servicio de Gmail
    auth: {
      user: "kronnersrl@gmail.com", // El correo de Gmail
      pass: "neem iued rnxb vkfu", // La contraseña de tu correo Gmail
    },
    tls: {
      rejectUnauthorized: false, // Permitir certificados no verificados
    },
  });

  let mailOptions = {
    from: `<kronnersrl@gmail.com>`,
    to: "hola@kronnerlogistica.com.ar",
    subject: `Nuevo mensaje de ${name}`,
    text: `Has recibido un nuevo mensaje de contacto.
        Nombre: ${name}
        Correo: ${email}
        Mensaje: 
        ${message}
    `,
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Correo enviado: %s", info.messageId);
    res.status(200).send({ message: "Correo enviado con éxito" });
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    res.status(500).send({ message: "Error al enviar el correo" });
  }
});

app.listen(port, () => {
  console.log(
    `Servidor de envío de correos escuchando en http://localhost:${port}`
  );
});
