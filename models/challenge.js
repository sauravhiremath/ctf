var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var challengeSchema = new Schema({
	index: Number,
	name: String,
	description: String,
	hint: String,
	answer: String,
	points: Number,
	solved: Array,
	hidden: Boolean
}, {
	collection: 'challenges'
});

module.exports = mongoose.model('Challenge', challengeSchema);
