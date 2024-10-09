import dbConnect from "@/lib/dbConnect"
import User from "@/models/User"
import { isValidObjectId } from "mongoose"
import { NextResponse } from "next/server"

// 'id' es el id del usuario
export async function GET(req: Request, { params }: { params: { id: string } }, res: Response) {
  try {
    const { id } = params

    if (!id || !isValidObjectId(id)) {
      return NextResponse.json({ message: "Id no proporsionado o inválido" }, { status: 401 })
    }

    await dbConnect()

    // Buscar al usuario por su id
    const user = await User.findById(id)

    if (!user) {
      return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 })
    }

    // Retornar las reservas del usuario
    return NextResponse.json(user.reservations, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Error interno en el servidor" }, { status: 500 })
  }
}