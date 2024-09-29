import mongoose, { Document, Schema } from 'mongoose';

interface IReservation extends Document {
  userId: mongoose.Schema.Types.ObjectId;  // ID del usuario que hizo la reserva
  reservedDate: Date;                      // Fecha de la reserva
  startTime: string;                       // Hora de inicio de la reserva
  endTime: string;                         // Hora de fin de la reserva
  totalHours: number;                      // Total de horas reservadas
  totalAmount: number;                     // Monto total a pagar
  expiresAt: Date;                         // Fecha y hora de expiración de la reserva
}

const ReservationSchema: Schema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  reservedDate: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  totalHours: {
    type: Number,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 },  // TTL Index para eliminar automáticamente la reserva después de la hora de fin
  }
}, { timestamps: true });

// Verificar si el modelo ya ha sido registrado para evitar errores
const Reservation = mongoose.models.Reservation || mongoose.model<IReservation>('Reservation', ReservationSchema);

export default Reservation;
