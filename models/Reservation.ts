import mongoose, { Schema } from 'mongoose';
import { Schedule } from '@/types/types';

// Esquema de la reserva para un día específico
const ReservationSchema = new Schema({
  day: {
    type: String,
    required: true,
  },
  schedule: [{
    hour: { type: String, required: true },
    occupied: { type: Boolean, default: false },
    status: { type: String, enum: ['available', 'pending', 'canceled', 'confirmed'], default: 'available' },
    reservedBy: { type: String, default: null }, // ID del usuario que hizo la reserva
  }],
  createdAt: { type: Date, default: Date.now },
});

// Index TTL para eliminar automáticamente la reserva un día después de su creación
ReservationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 }); // 86400 segundos = 1 día

// Modelo de Mongoose
const Reservation = mongoose.models.Reservation || mongoose.model('Reservation', ReservationSchema);

export default Reservation;
