import mongoose from "mongoose";
const Schema = mongoose.Schema;

const attemptedChallengeSchema = new Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Challenge"
    },
    participant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    timeSubmitted: {
      type: String,
      default: Date(),
    },
    pointsOnSubmission: Number
  },
);

export const attemptedChallenges = mongoose.model(
  "attemptedChallenges",
  attemptedChallengeSchema
);

export default attemptedChallenges;
