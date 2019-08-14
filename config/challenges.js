var Challenge = require('../models/challenge');
var User = require('../models/user');

module.exports = {
  get: function(next) {
    Challenge.find({}, function(err, challenges) {
      next(challenges);
    });
  },
  update: function(req, res, redirect) {
    if (req.user.role === 'admin') {
      Challenge.findOne({ '_id' : req.body.id }, function(err, challenge) {
        if (err) {
          console.log(err);
          return false;
        }
        challenge.index = req.body.index;
        challenge.name = req.body.name;
        challenge.points = req.body.points;
        challenge.description = req.body.description;
        challenge.answer = req.body.answer;
        challenge.hint = req.body.hint;
        challenge.hidden = Boolean(req.body.hidden);
        challenge.save();
        req.session.challenge = challenge.id;
        redirect(res);
      });
    }
  },
  add: function (req, res, redirect) {
    if (req.user.role === 'admin') {
      var newChallenge = new Challenge();
      newChallenge.index = req.body.index;
      newChallenge.name = req.body.name;
      newChallenge.points = req.body.points;
      newChallenge.description = req.body.description;
      newChallenge.answer = req.body.answer;
      newChallenge.hint = req.body.hint;
      newChallenge.hidden = Boolean(req.body.hidden);
      newChallenge.save(function(err) {
        if (err) throw err;
        req.session.challenge = 'new';
        redirect(res);
      });
    }
  },
  remove: function (req, res, redirect) {
    if (req.user.role === 'admin') {
      Challenge.findOne({ '_id' : req.body.id }).remove(function(err, challenge) {
        redirect(res);
      });
    }
  },
  verify: function(req, res, redirect) {
    Challenge.findOne({ '_id' : req.body.id }, function(err, challenge) {
      if (challenge.answer === req.body.answer && !~challenge.solved.indexOf(req.user.username) && !~req.user.solved.indexOf(challenge.id)) {
          challenge.solved.push(req.user._id);
          challenge.save();
        User.findOne({ 'username' : req.user.username }, function(err, user) {
            user.solved.push(challenge.id)
            user.lastSolved = (new Date()).getTime();
            user.points = user.points + challenge.points;
            user.save();
            req.session.challenge = challenge.id;
            redirect(res);
          });
      } else {
        req.session.challenge = challenge.id;
        redirect(res);
      }
    });
  }
}
