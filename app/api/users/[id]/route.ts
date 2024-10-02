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

// Ruta para obtener los datos de un usuario a través de su googleId o _id
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();

    const { id } = params;

    let user = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      // Si el id tiene el formato de un ObjectId, buscar por _id
      user = await User.findById(id).lean<IUser>();
    }

    // Si no se encontró por _id, buscar por googleId
    if (!user) {
      user = await User.findOne({ googleId: id }).lean<IUser>();
    }

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


// Ruta para eliminar un usuario a través de su id o googleId
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    // Conectar a la base de datos
    await dbConnect();

    // Verificar si el id es un ObjectId válido
    let user;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      // Buscar por _id si el id es un ObjectId válido
      user = await User.findById(id);
    } else {
      // Buscar por googleId si el id no es un ObjectId válido
      user = await User.findOne({ googleId: id });
    }

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    // Eliminar el usuario
    await User.findByIdAndDelete(user._id);

    return NextResponse.json({ message: "Usuario eliminado exitosamente" }, { status: 200 });
  } catch (error) {
    console.error("Error eliminando el usuario:", error);
    return NextResponse.json({ error: "Error eliminando el usuario" }, { status: 500 });
  }
}