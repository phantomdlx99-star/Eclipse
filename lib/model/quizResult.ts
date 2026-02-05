import mongoose, { Schema, model, models } from "mongoose";

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
  answers: [AnswerSchema],
});

QuizResultSchema.pre("save", async function () {
  const QuizModel = this.constructor as mongoose.Model<any>;

  const count = await QuizModel.countDocuments({ clerkId: this.clerkId });

  if (count >= 10) {
    const oldest = await QuizModel.findOne({ clerkId: this.clerkId }).sort({
      createdAt: 1,
    });

    if (oldest) {
      await QuizModel.deleteOne({ _id: oldest._id });
    }
  }
});

export const QuizResult =
  models.QuizResult || model("QuizResult", QuizResultSchema);
