import mongoose from "mongoose";
const Schema = mongoose.Schema;

const solvedChallengeSchema = new Schema(
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
      type: Date,
      default: Date.now
    },
    pointsOnSubmission: Number
  },
);

export const solvedChallenges = mongoose.model(
  "solvedChallenges",
  solvedChallengeSchema
);

export default solvedChallenges;
