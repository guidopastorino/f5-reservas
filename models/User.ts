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
  reservations: [{
    day: { type: String, required: true }, // Día de la reserva (YYYY-MM-DD)
    hour: { type: String, required: true }, // Hora reservada
    _id: false
  }],
  googleId: { type: String },
}, { timestamps: true });

// Método para comparar contraseñas
UserSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;