import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const leaderboard = new Schema({
	username: {type: String, required: true},
	points: { type: Number, default: 0 }	
});

const Leaderboard = mongoose.model('Leaderboard', leaderboard);

export default Leaderboard;