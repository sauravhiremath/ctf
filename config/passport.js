var login = require('./strategies/login');
var signup = require('./strategies/signup');
var User = require('../models/user');

module.exports = function(passport) {
	passport.serializeUser(function(user, done) {
		done(null, user._id);
	});
	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err,user);
		});
	});

	login(passport);
	signup(passport);
}
