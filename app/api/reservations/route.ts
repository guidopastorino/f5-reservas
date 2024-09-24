import { NextRequest, NextResponse } from 'next/server';
import Reservation from '@/models/Reservation';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

// Crear una nueva reserva (POST)
export async function POST(req: NextRequest) {
  try {
    await dbConnect()

    const { userId, reservedAt, status } = await req.json();

    if (!userId || !reservedAt) {
      return NextResponse.json({ message: 'userId y reservedAt son requeridos' }, { status: 400 });
    }

    const user = await User.findById(userId)

    if (!user) return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 })

    // Crear la nueva reserva
    const newReservation = new Reservation({
      userId,
      reservedAt: new Date(reservedAt), // Fecha (dia y hora totales) que el usuario tiene reservadas
      status: status || 'pending', // Estado predeterminado 'pending' si no se pasa ningún estado
    });

    // Agregar el id de la reserva en el array de reservas del usuario
    user.reservations.push(newReservation._id)

    await user.save()

    // Guardar en la base de datos
    const savedReservation = await newReservation.save();

    return NextResponse.json(savedReservation, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error al crear la reserva' }, { status: 500 });
  }
}