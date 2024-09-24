import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  color: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',        
    required: true
  },
  reservations: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reservation' }],
    default: [] // Default to an empty array
  }
}, { timestamps: true });

// Method to compare passwords
UserSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;