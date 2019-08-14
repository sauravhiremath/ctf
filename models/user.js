var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
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

module.exports = mongoose.model('User', userSchema);
