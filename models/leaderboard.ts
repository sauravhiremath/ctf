import mongoose from "mongoose";
const Schema = mongoose.Schema;

const leaderboard = new Schema({
  username: { type: String, required: true, unique: true },
  points: { type: Number, required: true, default: 0 }
  },
);

const Leaderboard = mongoose.model("Leaderboard", leaderboard);

export default Leaderboard;
