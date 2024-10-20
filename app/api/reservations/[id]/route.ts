import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import dbConnect from "@/lib/dbConnect";
import Reservation from "@/models/Reservation";
import { ScheduleProps } from "@/types/types";
import User from "@/models/User";
import { sendEmail } from "@/utils/emailService";
import Notification from "@/models/Notification";

// Verifica si el string es una fecha válida
function isValidDate(dateString: string) {
  const date = new Date(dateString);
  return !isNaN(date.getTime()); // Devuelve `true` si es una fecha válida
}

// Obtiene los datos de una reserva (a través de su '_id' o 'day')
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
      return NextResponse.json({
        message: "No se encontró la reserva.",
        reservation: null
      }, { status: 404 });
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

    if (!hour || !userId) {
      return NextResponse.json({ message: 'Datos incompletos: faltan hora o ID de usuario.' }, { status: 400 });
    }

    // Validar formato de hora
    const isValidHour = /^([0-1]\d|2[0-3]):([0-5]\d)$/.test(hour);
    if (!isValidHour) {
      return NextResponse.json({ message: 'Hora no válida.' }, { status: 400 });
    }

    const reservation = await Reservation.findOne({ day: params.id }).catch(() => null);
    if (!reservation) {
      return NextResponse.json({ message: 'Reserva no encontrada.' }, { status: 404 });
    }

    const today = new Date();
    const reservationDay = new Date(params.id);
    const [hourPart, minutePart] = hour.split(":").map(Number);
    const reservationTime = new Date(reservationDay);
    reservationTime.setHours(hourPart, minutePart, 0, 0);

    // Verificar si la hora ya pasó (si es el mismo día)
    if (reservationDay.toDateString() === today.toDateString() && reservationTime < today) {
      return NextResponse.json({ message: 'La hora ya ha expirado.' }, { status: 400 });
    }

    const matchHour = reservation.schedule.find((slot: ScheduleProps) => slot.hour === hour);
    if (!matchHour) {
      return NextResponse.json({ message: 'Horario no disponible.' }, { status: 404 });
    }

    if (matchHour.occupied) {
      return NextResponse.json({ message: 'Horario ya está reservado.' }, { status: 400 });
    }

    // Actualizar horario reservado
    matchHour.occupied = true;
    matchHour.status = 'pending';
    matchHour.reservedBy = userId;

    await reservation.save();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: 'Usuario no encontrado.' }, { status: 404 });
    }

    // Agregar reservación hecha en el array 'reservations' del usuario
    user.reservations.push({
      reservationDay: reservation.day,
      scheduleId: matchHour._id,
      createdAt: Date.now() // Indica cuando el usuario realizó la reserva
    });

    // Crear notificación
    const notification = new Notification({
      type: "reservation",
      title: "Reserva hecha exitosamente",
      message: `La reserva para el día ${params.id} y hora ${hour} se ha efectuado exitosamente. Puedes consultar tu correo para más información.`
    });

    user.notifications.push(notification._id);

    await user.save();
    await notification.save();

    // Enviar email
    const htmlContent = `
<div style="text-align: center;">
  <img src="https://static.vecteezy.com/system/resources/thumbnails/013/366/674/small_2x/foot-ball-or-soccer-ball-icon-symbol-for-art-illustration-logo-website-apps-pictogram-news-infographic-or-graphic-design-element-format-png.png" 
        alt="Icono de fútbol" 
        style="width: 100px; height: auto; margin-bottom: 20px;"/>
  <h2>Hola, ${user.fullname || 'Usuario'}!</h2>
  <p>La reserva se ha efectuado exitosamente.</p>
  <p>Puedes consultar los detalles a través del siguiente link: 
    <a href="${process.env.NEXTAUTH_URL}/reservations/${reservation._id}">
      Consultar detalles reserva
    </a>
  </p>
  <p>Saludos,</p>
  <p>Equipo de F5 Reservas Fighiera</p>
</div>
`;

    try {
      await sendEmail(process.env.ACCOUNT_APP_EMAIL || "", [user.email], "Reserva hecha exitosamente", { html: htmlContent });
      console.log('Correo de confirmación enviado exitosamente.');
    } catch (error) {
      console.error('Error al enviar el correo de confirmación:', error);
    }

    return NextResponse.json({ message: 'Reserva realizada con éxito.' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error en el servidor.' }, { status: 500 });
  }
}