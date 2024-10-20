// Ruta para obtener los datos de un horario de la reserva (ScheduleProps)

import Reservation from "@/models/Reservation"
import { ScheduleProps } from "@/types/types"
import { NextResponse } from "next/server"

// 'id' es el '_id' o 'day' de la reserva y 'scheduleId' es el id del objeto del horario
// Generalmente se harán las llamadas buscando la reserva por la fecha, por lo que la reserva se buscará por su 'day'
export async function GET(req: Request, { params }: { params: { id: string, scheduleId: string } }, res: Response) {
  try {
    const { id, scheduleId } = params
    // Buscar la reserva
    const reservation = await Reservation.findOne({ day: id })

    if (!reservation) return NextResponse.json({ message: "No se encontró la reserva" }, { status: 404 })

    // Luego, buscar en el array 'schedule' el objeto con '_id' igual a 'scheduleId'
    const schedule = reservation.schedule.find((el: ScheduleProps) => el._id == scheduleId)

    if (!schedule) return NextResponse.json({ message: "No se encontró el horario" }, { status: 404 })

    return NextResponse.json(schedule, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}