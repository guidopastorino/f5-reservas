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
    default: 'user'
  },
  reservations: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reservation' }],
    default: [] // Default to an empty array
  },
  googleId: { type: String },
}, { timestamps: true });

// Method to compare passwords
UserSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;