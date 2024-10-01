import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";

interface IUser {
  _id: string;
  fullname: string;
  username: string;
  email: string;
  password: string;
  color?: string;
  role?: string;
}

// Ruta para obtener los datos de un usuario a través de su id
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();

    const { id } = params;

    // Buscar el usuario en la base de datos
    const user = await User.findById(id).lean<IUser>();

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    // Eliminar la contraseña del usuario (si existe)
    const { password, ...userData } = user || {};

    // Devolver los datos del usuario (sin la contraseña)
    return NextResponse.json(userData, { status: 200 });
  } catch (error) {
    console.error("Error al obtener el usuario", error);
    return NextResponse.json({ error: "Error al obtener el usuario" }, { status: 500 });
  }
}

// Ruta para eliminar un usuario a través de su id
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    // Conectar a la base de datos
    await dbConnect();

    // Verificar si el usuario existe
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    // Eliminar el usuario
    await User.findByIdAndDelete(id);

    return NextResponse.json({ message: "Usuario eliminado exitosamente" }, { status: 200 });
  } catch (error) {
    console.error("Error eliminando el usuario:", error);
    return NextResponse.json({ error: "Error eliminando el usuario" }, { status: 500 });
  }
}