import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Servidor SMTP de Gmail
  port: 587, // Puerto para TLS
  secure: false,
  auth: {
    user: process.env.ACCOUNT_APP_EMAIL, // Tu dirección de correo de Gmail
    pass: process.env.ACCOUNT_APP_PASSWORD, // Tu contraseña de Gmail
  },
});

/**
 * Envía un correo electrónico a una lista de destinatarios.
 * @param {string} from - La dirección de correo del remitente.
 * @param {string[]} emails - Array de direcciones de correo de los destinatarios.
 * @param {string} asunto - El asunto del correo.
 * @param {string | { text?: string; html?: string }} contenido - El contenido del correo (texto o HTML).
 * @returns {Promise<void>} - Una promesa que se resuelve cuando se envían todos los correos.
 */
export const sendEmail = async (
  from: string,
  emails: string[],
  asunto: string,
  contenido: string | { text?: string; html?: string }
) => {
  const promises = emails.map(email => {
    return transporter.sendMail({
      from,
      to: email,
      subject: asunto,
      ...(typeof contenido === 'string'
        ? { text: contenido } // Si el contenido es solo texto
        : { ...contenido }) // Si es un objeto con texto y/o HTML
    });
  });

  try {
    await Promise.all(promises);
    console.log('Correos enviados exitosamente');
  } catch (error) {
    console.error('Error al enviar correos:', error);
  }
};
