import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import dbConnect from "@/lib/dbConnect";
import Reservation from "@/models/Reservation";
import { Schedule } from "@/types/types";
import User from "@/models/User";

// Verifica si el string es una fecha válida
function isValidDate(dateString: string) {
  const date = new Date(dateString);
  return !isNaN(date.getTime()); // Devuelve `true` si es una fecha válida
}

// Obtiene los datos de una reserva (a través de su _id o 'date')
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    await dbConnect();

    let reservation;
    if (isValidDate(id)) {
      // Buscar reservas por fecha (YYYY-MM-DD)
      reservation = await Reservation.findOne({ day: id });
    } else {
      // Buscar por ID de la reserva
      reservation = await Reservation.findOne({ _id: new ObjectId(id) });
    }

    if (!reservation) {
      return NextResponse.json({ message: "No se encontró la reserva." }, { status: 404 });
    }

    return NextResponse.json(reservation);
  } catch (error) {
    return NextResponse.json({ message: "Error al obtener la reserva" }, { status: 500 });
  }
}

// Actualiza el objeto del array schedule que coincide con la hora, poniendo los datos reservados.
// Si la hora a reservar ya expiró, se envía un error (siempre y cuando el día sea el mismo día que esté reservando)
// El 'id' es la fecha: YYYY/MM/DD
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();

    const { hour, userId } = await req.json();

    console.log("data: ", { hour, userId })

    if (!hour || !userId) {
      return NextResponse.json({ message: 'Datos incompletos: faltan hora o ID de usuario.' }, { status: 400 });
    }

    const reservation = await Reservation.findOne({ day: params.id });
    if (!reservation) {
      return NextResponse.json({ message: 'Reserva no encontrada.' }, { status: 404 });
    }

    const today = new Date();
    const reservationDay = new Date(params.id);
    const [hourPart, minutePart] = hour.split(":").map(Number);
    const reservationTime = new Date(reservationDay);
    reservationTime.setHours(hourPart, minutePart, 0, 0);

    if (reservationDay.toDateString() === today.toDateString() && reservationTime < today) {
      return NextResponse.json({ message: 'La hora ya ha expirado.' }, { status: 400 });
    }

    const matchHour = reservation.schedule.find((slot: Schedule) => slot.hour === hour);
    if (!matchHour) {
      return NextResponse.json({ message: 'Horario no disponible.' }, { status: 404 });
    }

    if (matchHour.occupied) {
      return NextResponse.json({ message: 'Horario ya está reservado.' }, { status: 400 });
    }

    matchHour.occupied = true;
    matchHour.status = 'pending';
    matchHour.reservedBy = userId;

    await reservation.save();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: 'Usuario no encontrado.' }, { status: 404 });
    }

    user.reservations.push({ day: params.id, hour });
    await user.save();

    return NextResponse.json({ message: 'Reserva realizada con éxito.' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error en el servidor.' }, { status: 500 });
  }
}