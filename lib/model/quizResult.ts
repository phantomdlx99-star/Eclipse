// models/QuizResult.ts
import mongoose, { Schema, model, models } from "mongoose";

const QuizResultSchema = new Schema({
  clerkId: { type: String, required: true, index: true },
  subjectId: { type: String, required: true },
  chapterId: { type: String, required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

// PRE-SAVE HOOK: Automatically limits results to 10 per user
// Correct modern implementation for QuizResult.ts
QuizResultSchema.pre("save", async function () {
  // 'this' refers to the current quiz document being saved
  const QuizModel = mongoose.model("QuizResult");

  // Count existing quizzes for this user
  const count = await QuizModel.countDocuments({ clerkId: this.clerkId });

  if (count >= 10) {
    // Find the single oldest quiz
    const oldest = await QuizModel.findOne({ clerkId: this.clerkId }).sort({
      createdAt: 1,
    });

    if (oldest) {
      await QuizModel.deleteOne({ _id: oldest._id });
    }
  }
  // No next() needed because the function is async
});

export const QuizResult =
  models.QuizResult || model("QuizResult", QuizResultSchema);
