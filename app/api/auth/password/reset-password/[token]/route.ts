import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";

export async function POST(req: Request, { params }: { params: { token: string } }) {
  const { password } = await req.json();
  const { token } = params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    console.log(decoded)
    await dbConnect();

    const userId = decoded.id;

    if (!userId) {
      return NextResponse.json({ error: "Token no válido" }, { status: 400 });
    }

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    await user.save();

    return NextResponse.json({ message: "Contraseña actualizada" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Token no válido o expirado" }, { status: 400 });
  }
}
