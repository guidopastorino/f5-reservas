import mongoose, { Schema, CallbackError } from 'mongoose';

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
  expirationDate: { type: Date, required: true }, // Nueva propiedad para la fecha de expiración
});

// Middleware pre-save para calcular `expirationDate`
ReservationSchema.pre('save', function (next: (err?: CallbackError) => void) {
  try {
    // Asegúrate de que 'day' esté en formato ISO 8601 (ej: '2024-10-09')
    const reservationDay = new Date(this.day);

    // Verificar si `day` es una fecha válida
    if (isNaN(reservationDay.getTime())) {
      return next(new Error('El campo `day` debe ser una fecha válida.') as CallbackError);
    }

    // Establecer la fecha de expiración (1 día después de la fecha `day`)
    const expirationTimeInSeconds = 86400; // 1 día en segundos
    this.expirationDate = new Date(reservationDay.getTime() + expirationTimeInSeconds * 1000);

    next();
  } catch (error) {
    next(error as CallbackError);
  }
});

// Index TTL para eliminar automáticamente la reserva un día después de su fecha 'day'
ReservationSchema.index({ expirationDate: 1 }, { expireAfterSeconds: 0 });

// Modelo de Mongoose
const Reservation = mongoose.models.Reservation || mongoose.model('Reservation', ReservationSchema);

export default Reservation;