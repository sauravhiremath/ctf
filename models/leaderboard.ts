import mongoose from "mongoose";
const Schema = mongoose.Schema;

const leaderboard = new Schema({
	username: { type: String, required: true, unique: true },
	points: { type: Number, required: true, default: 0, index: true }
});

interface leaderboardInterface extends mongoose.Document {
	username: string,
	points: number
}

const Leaderboard = mongoose.model<leaderboardInterface>("Leaderboard", leaderboard);

export default Leaderboard;
