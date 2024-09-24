import { NextRequest, NextResponse } from 'next/server';
import Reservation from '@/models/Reservation';
import dbConnect from '@/lib/dbConnect';



// Obtener detalles de la reserva por id (GET)
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const reservationId = params.id;

    // Conectamos a la base de datos
    await dbConnect();
    
    // Buscar la reserva por ID
    const reservation = await Reservation.findById(reservationId).populate('userId', 'email fullname');

    if (!reservation) {
      return NextResponse.json({ message: 'Reserva no encontrada' }, { status: 404 });
    }

    return NextResponse.json(reservation);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error al obtener la reserva' }, { status: 500 });
  }
}