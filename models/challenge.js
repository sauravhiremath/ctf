var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var challengeSchema = new Schema({
	index: Number,
	name: String,
	description: String,
	hint: {type: String, default: null},
	answer: String,
	startPoints: Number,
	solved: Array,
	hidden: Boolean
}, {
	collection: 'challenges'
});

module.exports = mongoose.model('Challenge', challengeSchema);
