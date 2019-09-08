import mongoose from "mongoose";
const Schema = mongoose.Schema;

const challengeSchema = new Schema({
    // index: Number,
    name: String,
    description: String,
    hint: { type: String, default: null },
    answer: String,
    startPoints: Number,
    currentPoints: Number,
    solvedBy: Array,
    hidden: { type: Boolean, required: false }
});

export const Challenge = mongoose.model("Challenge", challengeSchema);
export default Challenge;
