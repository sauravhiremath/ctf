import mongoose from "mongoose";
import attemptedChallengesInterface from './solvedChallenges'
const Schema = mongoose.Schema;

const challengeSchema = new Schema({
    // index: Number,
    name: String,
    description: String,
    hint: { type: String, default: null },
    answer: String,
    startPoints: Number,
    currentPoints: Number,
    solvedBy: String,
    hidden: { type: Boolean, required: false }
});

export interface challengeInterface extends mongoose.Document {
    name: string,
    description: string,
    hint: string
    answer: string,
    startPoints: number,
    currentPoints: number,
    solvedBy: string,
    hidden: boolean
}
export const Challenge = mongoose.model<challengeInterface>("Challenge", challengeSchema);
export default Challenge;
