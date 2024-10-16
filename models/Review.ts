import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  username: { type: String, required: true },
  review: { type: String, required: true },
  stars: { type: Number, default: 0, min: 0, max: 5 },
}, { timestamps: true });

const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema)

export default Review