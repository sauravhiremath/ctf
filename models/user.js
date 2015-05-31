var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	username: String,
	password: String,
	email: String,
	school: String,
	solved: Array,
	lastSolved: Number,
	points: { type: Number, default: 0 },
	role: { type: String, default: 'participant' }
}, {
	collection: 'users'
});

module.exports = mongoose.model('User', userSchema);
