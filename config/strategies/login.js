var LocalStrategy = require('passport-local').Strategy,
		User = require('../../models/user'),
		bCrypt = require('bcryptjs');

var isValidPassword = function(user, password) {
	return bCrypt.compareSync(password, user.password);
}

module.exports = function(passport) {
	passport.use('login', new LocalStrategy({
			passReqToCallback : true
		},
		function(req, username, password, done) {
			User.findOne({ 'username' : username },
				function(err, user) {
					if (err) {
						return done(err);
					}
					if (!user) {
						return done(null, false, req.flash('loginMessage', 'User not found with username ' + username));
					}
					if (!isValidPassword(user, password)) {
						return done(null, false, req.flash('loginMessage', 'Invalid password.'));
					}
					if (user && isValidPassword(user, password)) {
						console.log(user.username + ' logged in');
						return done(null, user);
					}
				}
			);
	}));
}
