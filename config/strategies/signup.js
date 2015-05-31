var LocalStrategy = require('passport-local').Strategy;
var User = require('../../models/user');
var bCrypt = require('bcryptjs');

module.exports = function(passport) {
	passport.use('signup', new LocalStrategy({
			passReqToCallback : true
		},
		function(req, username, password, done) {
			findOrCreateUser = function() {
				User.findOne({'username':username}, function (err, user) {
					if (err) {
						console.log('Error during registration: ' + err);
						return done(err);
					}
					if (user) {
						return done(null, false, req.flash('signupMessage', 'User already exists.'));
					} else {
						User.findOne({'email':req.body.email}, function (err, user) {
							if (err) {
								console.log('Error during registration: ' + err);
								return done(err);
							}
							if (user) {
								return done(null, false, req.flash('signupMessage', 'Email already registered.'));
							} else {
								var newUser = new User();
								newUser.username = username;
								newUser.password = createHash(password);
								newUser.email = req.body.email;
								newUser.school = req.body.school;
								newUser.lastSolved = (new Date()).getTime();

								newUser.save(function(err) {
									if (err) {
										console.log('Error in saving user: ' + err);
										throw err;
									}
									console.log('Successfully registered user: ' + newUser.username);
									return done(null, newUser);
								});
							}
						});
					}
				});
			};
			process.nextTick(findOrCreateUser);
		})
	);

	var createHash = function(password) {
		return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	}

};
