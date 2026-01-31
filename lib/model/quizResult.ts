// models/quizResult.ts
import mongoose, { Schema, model, models } from "mongoose";

// Defining a sub-schema for answers ensures every field is validated and saved
const AnswerSchema = new Schema({
  question: { type: String, required: true },
  selected: { type: String, required: true },
  correct: { type: String, required: true },
});

const QuizResultSchema = new Schema({
  clerkId: { type: String, required: true, index: true },
  subjectId: { type: String, required: true },
  chapterId: { type: String, required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  // Use the sub-schema instead of a generic Array
  answers: [AnswerSchema],
});

// PRE-SAVE HOOK: Automatically limits results to 10 per user
QuizResultSchema.pre("save", async function () {
  // Use this.constructor to avoid "Model not found" or "Overwrite" errors in Next.js
  const QuizModel = this.constructor as mongoose.Model<any>;

  // Count existing quizzes for this user
  const count = await QuizModel.countDocuments({ clerkId: this.clerkId });

  if (count >= 10) {
    // Find and delete the oldest quiz if the limit is reached
    const oldest = await QuizModel.findOne({ clerkId: this.clerkId }).sort({
      createdAt: 1,
    });

    if (oldest) {
      await QuizModel.deleteOne({ _id: oldest._id });
    }
  }
});

// Export the model, ensuring we don't redefine it if it already exists
export const QuizResult =
  models.QuizResult || model("QuizResult", QuizResultSchema);
