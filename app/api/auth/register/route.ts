// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import { generateRandomColor } from "@/utils/generateRandomColor";

export async function POST(req: Request) {
  const { fullname, username, email, password } = await req.json();

  await dbConnect();

  // Verificar si el usuario o email ya están en uso
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });

  if (existingUser) {
    return NextResponse.json({ error: "Usuario o Email ya están en uso" }, { status: 400 });
  }

  // Encriptar la contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // Crear nuevo usuario
  const newUser = new User({
    fullname,
    username,
    email,
    password: hashedPassword,
    color: generateRandomColor(),
  });

  await newUser.save();

  return NextResponse.json({ message: "Usuario creado exitosamente" }, { status: 201 });
}
