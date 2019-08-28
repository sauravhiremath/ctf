import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'leaderboard'
	},
	name: {type: String, required: true},
	regNo: {type: String, required: true},
	password: String,
	email: String,
	phoneNo: {type: Number, required: true},
	solved: Array,
	points: { type: Number, default: 0 },
	role: { type: String, default: 'participant' }
}, {
	collection: 'users'
});


export const User = mongoose.model('User', userSchema);
export default User;