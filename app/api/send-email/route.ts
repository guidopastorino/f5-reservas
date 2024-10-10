import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from 'nodemailer';
import User from "@/models/User"; // Asegúrate que este modelo esté importado correctamente

export async function POST(req: NextRequest) {
  const { from, destinarios, asunto, contenido } = await req.json();

  // Conectar a la base de datos
  await dbConnect();

  let emails: string[] = [];

  // Si 'destinarios' está vacío, obtener todos los usuarios
  if (!destinarios) {
    const users = await User.find({}); // Usar el modelo User para obtener los usuarios
    emails = users.map((user: { email: string }) => user.email); // Mapear los correos electrónicos
    console.log(emails)
  } else {
    emails = [destinarios]; // Si hay un destinatario específico, lo agregamos
  }

  // Filtrar para que el remitente no reciba el correo
  emails = emails.filter(email => email !== from);

  // Si después de filtrar no hay destinatarios, devolver un error
  if (emails.length === 0) {
    return NextResponse.json({ success: false, error: "No hay destinatarios válidos." }, { status: 400 });
  }

  // Configurar el transporter de nodemailer
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // Servidor SMTP de Gmail
    port: 587, // Puerto para TLS
    secure: false, // true para puerto 465, false para otros puertos
    auth: {
      user: process.env.ACCOUNT_APP_EMAIL, // Tu dirección de correo de Gmail
      pass: process.env.ACCOUNT_APP_PASSWORD, // Tu contraseña de Gmail
    },
  });

  // Enviar el correo electrónico
  const promises = emails.map(email => {
    return transporter.sendMail({
      from,
      to: email,
      subject: asunto,
      text: contenido,
    });
  });

  try {
    await Promise.all(promises);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    return NextResponse.json({ success: false, error: "Error al enviar el correo." }, { status: 500 });
  }
}
