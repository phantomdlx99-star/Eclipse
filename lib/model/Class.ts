import mongoose, { Schema } from "mongoose";

const classSchema = new Schema({
  classId: { type: String, required: true },
  slug: { type: String, required: true },
  gradeNumber: { type: Number, required: true },
  subjects: { type: [String], required: true },
  color: { type: String },
  features: { type: [String] },
  subtitle: { type: String },
  title: { type: String },
});

const Classes =
  mongoose.models.Classes || mongoose.model("Classes", classSchema);

export default Classes;
