import mongoose from "mongoose";
import attemptedChallengesInterface from './solvedChallenges'
const Schema = mongoose.Schema;
// enum diff { baby ="baby", easy ="easy", medium = "medium", hard = "hard" };
// enum type { web ="web", forensics = "forensics", steganography = "steganography", pawn = "pawn" };

const challengeSchema = new Schema({
    // index: Number,
    name: { type:String, unique: true },
    description: String,
    difficulty: String,
    type: String,
    hint: { type: String, default: null },
    answer: String,
    startPoints: Number,
    currentPoints: Number,
    solvedBy: Array,
    hidden: { type: Boolean, required: false }
});

interface solvedByUser {
    username: string,
    usertime: string
}
export interface challengeInterface extends mongoose.Document {
    name: string,
    description: string,
    difficulty: Array<string>,
    type: Array<string>,
    hint: string,
    answer: string,
    startPoints: number,
    currentPoints: number,
    solvedBy: solvedByUser[],
    hidden: boolean
}
export const Challenge = mongoose.model<challengeInterface>("Challenge", challengeSchema);
export default Challenge;
