import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";

export async function POST(req: Request) {
  const { email } = await req.json();

  await dbConnect();

  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json({ error: "El usuario no existe" }, { status: 404 });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "1h" });
  const resetUrl = `${process.env.NEXTAUTH_URL}/account/reset-password?token=${token}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.ACCOUNT_APP_EMAIL,
      pass: process.env.ACCOUNT_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.ACCOUNT_APP_EMAIL,
    to: user.email,
    subject: "Recuperación de contraseña",
    html: `<p>Haz clic en el siguiente enlace para recuperar tu contraseña:</p><a href="${resetUrl}">Recuperar contraseña</a>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: "Correo enviado" }, { status: 200 });
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Error al enviar el correo" }, { status: 500 });
  }
}