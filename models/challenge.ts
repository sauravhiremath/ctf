import mongoose from "mongoose";
const Schema = mongoose.Schema;

const challengeSchema = new Schema(
  {
    index: Number,
    name: String,
    description: String,
    hint: { type: String, default: null },
    answer: String,
    startPoints: Number,
    solved: Array,
    hidden: Boolean
  },
  {
    collection: "challenges"
  }
);

export const Challenge = mongoose.model("Challenge", challengeSchema);
export default Challenge;
