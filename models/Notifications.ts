import mongoose, { Schema } from "mongoose";

const NotificationSchema = new Schema({
  _id: { type: String },
  to: { type: String, ref: 'User' },
  type: { type: String, enum: ["account", "email", "reservation"], default: "account" },
  title: { type: String, default: "Notificación emergente" },
  message: { type: String, required: true },
  seen: { type: Boolean, default: false },
}, { timestamps: true });

const Notification = mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);

export default Notification;
