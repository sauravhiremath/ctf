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
    solvedBy: {type: JSON},
    hidden: { type: Boolean, required: false }
});

interface challengeInterface extends mongoose.Document {
    name: string,
    description: string,
    hint: string
    answer: string,
    startPoints: number,
    currentPoints: number,
    solvedBy: [],
    hidden: boolean
}
export const Challenge = mongoose.model<challengeInterface>("Challenge", challengeSchema);
export default Challenge;
