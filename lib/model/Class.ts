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

const subjectShema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    chapters: { type: [String], required: true },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classes",
      required: true,
    },
  },
  { timestamps: true }
);

const Classes =
  mongoose.models.Classes || mongoose.model("Classes", classSchema);

const Subjects =
  mongoose.models.Subjects || mongoose.model("Subjects", subjectShema);

export { Classes, Subjects };
