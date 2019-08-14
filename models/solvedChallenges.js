var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var solvedChallengeSchema = new Schema({
	questionId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Challenge'
	},
	participant: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	timeSubmitted: {type: Date, default: Date.now},
	pointsOnSubmission: Number
}, {
	collection: 'challenges'
});

module.exports = mongoose.model('solvedChallenges', solvedChallengeSchema);
