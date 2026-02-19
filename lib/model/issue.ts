// @/lib/model/issue.ts
import mongoose, { Schema, model, models } from "mongoose";

const issueSchema = new Schema({
  question: { type: String, required: true },
  issue: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  clerkId: { type: String, required: true },
});

// This ensures the model is only created once
export const Issue = models.Issue || model("Issue", issueSchema);
