import mongoose from "mongoose";

const AvailabilitySchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true },
  availabilities: {
    monday: [{ startTime: String, endTime: String }],
    tuesday: [{ startTime: String, endTime: String }],
    wednesday: [{ startTime: String, endTime: String }],
    thursday: [{ startTime: String, endTime: String }],
    friday: [{ startTime: String, endTime: String }],
    saturday: [{ startTime: String, endTime: String }],
    sunday: [{ startTime: String, endTime: String }],
  },
});

export default mongoose.models.Availability ||
  mongoose.model("Availability", AvailabilitySchema);
