import { ReservationStatus } from '@/types/types';
import mongoose, { Document, Schema } from 'mongoose';

interface IReservation extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  reservedAt: Date;
  status: ReservationStatus;
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
  status: {
    type: String,
    enum: Object.values(ReservationStatus),
    default: ReservationStatus.PENDING, // Estado predeterminado
  }
}, { timestamps: true });

// Verificar si el modelo ya ha sido registrado para evitar el error
const Reservation = mongoose.models.Reservation || mongoose.model<IReservation>('Reservation', ReservationSchema);

export default Reservation;
