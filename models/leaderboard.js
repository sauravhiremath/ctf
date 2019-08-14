var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var leaderboard = new Schema({
	username: {type: String, required: true},
	points: { type: Number, default: 0 }	
});

module.exports = mongoose.model('leaderboard', leaderboard);
