import mongoose, { Document, Schema } from 'mongoose';
import { ReservationStatus } from '@/types/types';

interface IReservation extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  reservedAt: Date;
  duration: number; // Duración en horas
  price: number;    // Precio total de la reserva
  status: ReservationStatus;
  cancelableUntil: Date; // Fecha límite para cancelar
}

const ReservationSchema: Schema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  reservedAt: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number,
    required: true, // 1, 2 o 3 horas
    min: 1,
    max: 3,
  },
  price: {
    type: Number,
    required: true, // Se calculará en función de las horas y el número de jugadores
  },
  cancelableUntil: {
    type: Date, // Hora límite para cancelar la reserva (2 horas antes de la reserva)
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(ReservationStatus),
    default: ReservationStatus.PENDING,
  }
}, { timestamps: true });

const Reservation = mongoose.models.Reservation || mongoose.model<IReservation>('Reservation', ReservationSchema);

export default Reservation;