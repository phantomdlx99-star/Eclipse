import mongoose, { model, Schema } from "mongoose";

const classesSchema = new Schema(
  {
    // Renamed from 'classId' to 'grade' to align with usage in page.tsx (e.g., "09", "10")
    classId: {
      type: String,
      required: true,
      unique: true, // Assuming grades should be unique
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // Using [String] is the correct Mongoose way for an array of strings
    subjects: {
      type: [String],
      required: true,
    },
    color: {
      type: String,
      default: "indigo", // Added a default color
    },
    features: {
      type: [String],
    },
    subtitle: {
      type: String,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Mongoose automatically pluralizes the model name 'Classes' to collection 'classes'
const Classes = mongoose.models.Classes || model("Classes", classesSchema);

export default Classes;
