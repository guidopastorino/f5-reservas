import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User"; // Asegúrate de importar el modelo de usuario y el tipo IUser
import dbConnect from "@/lib/dbConnect"; // Importa la conexión a la base de datos

// Definir el tipo de usuario en TypeScript
interface IUser {
  _id: string;
  fullname: string;
  username: string;
  email: string;
  password: string;
  color?: string; // Si tienes el campo color
  role?: string;  // Si tienes el campo role
}

// Ruta para obtener los datos de un usuario a través de su id
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Conexión a la base de datos
    await dbConnect();

    const { id } = params; // Aquí obtienes el id desde los parámetros de la URL

    // Buscar el usuario en la base de datos
    const user = await User.findById(id).lean<IUser>(); // Le indicas a TypeScript que el usuario es del tipo IUser

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
