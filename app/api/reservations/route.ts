import { NextResponse } from 'next/server';
import dbConnect from "@/lib/dbConnect";
import Reservation from "@/models/Reservation";

// Obtener todas las reservas
export async function GET(req: Request) {
  try {
    await dbConnect();
    const reservations = await Reservation.find(); // Obtener todas las reservas

    return NextResponse.json({ reservations });
  } catch (error) {
    return NextResponse.json({ message: "Error al obtener las reservas" }, { status: 500 });
  }
}

// Crear nuevas reservas para los próximos 7 días (sirve para llamar la ruta con el cron job)
export async function POST(req: Request) {
  const fixedHours = ["13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"];
  const today = new Date(); // Fecha actual

  try {
    await dbConnect();

    // Generar las fechas para los próximos 7 días
    for (let i = 0; i < 7; i++) {
      // Sumar 'i' días a la fecha actual
      const futureDate = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
      const reservationDay = futureDate.toISOString().split('T')[0]; // Solo el día en formato 'YYYY-MM-DD'

      // Verificar si ya existen reservas para ese día
      const existingReservation = await Reservation.findOne({ day: reservationDay });

      if (!existingReservation) {
        // Si no existen, agregar las horas fijas
        const schedule = fixedHours.map(hour => ({
          hour,
          occupied: false,
          reservedBy: null,
        }));

        // Calcular la fecha de expiración (1 día después del día de la reserva)
        const expirationDate = new Date(futureDate.getTime() + 24 * 60 * 60 * 1000);

        // Crear la nueva reservación con el campo expirationDate
        const newReservation = new Reservation({
          day: reservationDay,
          schedule,
          expirationDate,  // Asignar la fecha de expiración
        });

        await newReservation.save();
        console.log(`Reservaciones agregadas para el día: ${reservationDay}`);
      } else {
        console.log(`Las reservaciones para el día ${reservationDay} ya existen.`);
      }
    }

    return NextResponse.json({ message: "Reservaciones para los próximos 7 días agregadas o ya existentes." });
  } catch (error) {
    console.error("Error al agregar reservaciones:", error);
    return NextResponse.json({ message: "Error al agregar reservaciones" }, { status: 500 });
  }
}

// Actualizar una reserva
// @params: id de la reserva, y un nuevo estado u ocupación para las horas
export async function PUT(req: Request) {
  const { id, hour, status, reservedBy } = await req.json();

  try {
    await dbConnect();

    // Buscar la reserva por ID y actualizar el horario específico
    const reservation = await Reservation.findById(id);

    if (!reservation) {
      return NextResponse.json({ message: "Reserva no encontrada" }, { status: 404 });
    }

    // Buscar la hora especificada y actualizarla
    const match = reservation.schedule.find((m: any) => m.hour === hour);

    if (!match) {
      return NextResponse.json({ message: "Horario no encontrado" }, { status: 404 });
    }

    // Actualizar el estado y quién reservó, si es necesario
    if (status) match.status = status;
    if (reservedBy) match.reservedBy = reservedBy;

    await reservation.save();
    return NextResponse.json({ message: "Reserva actualizada exitosamente" });
  } catch (error) {
    console.error("Error al actualizar la reserva:", error);
    return NextResponse.json({ message: "Error al actualizar la reserva" }, { status: 500 });
  }
}

// Eliminar todas las reservas
export async function DELETE(req: Request) {
  try {
    await dbConnect();
    await Reservation.deleteMany(); // Eliminar todas las reservas

    return NextResponse.json({ message: "Todas las reservas han sido eliminadas." });
  } catch (error) {
    console.error("Error al eliminar las reservas:", error);
    return NextResponse.json({ message: "Error al eliminar las reservas" }, { status: 500 });
  }
}
