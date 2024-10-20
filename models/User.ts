import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
  fullname: { type: String },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  color: { type: String },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  reservations: {
    type: [{
      reservationDay: { type: String, required: true }, // Día de la reserva (YYYY-MM-DD)
      scheduleId: { type: String, required: true }, // Id del objeto de calendario del horario
      createdAt: { type: Date },
      _id: false
    }],
    default: [] // Valor predeterminado como array vacío
  },
  notifications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Notification', // Referencia al modelo 'Notification'
  }],
  googleId: { type: String },
}, { timestamps: true });

// Método para comparar contraseñas
UserSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;