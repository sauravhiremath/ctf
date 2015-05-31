var Challenge = require('../models/challenge'),
    User = require('../models/user');
    bCrypt = require('bcryptjs');

var createHash = function(password) {
	return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}
var isValidPassword = function(user, password) {
	return bCrypt.compareSync(password, user.password);
}

module.exports = {
  get: function(next) {
    User.find({}, function(err, users) {
      next(users);
    });
  },
  update: function(req, res, redirect) {
    if (req.body.action === 'update-profile') {
      if (req.user.id === req.body.id) {
        if (isValidPassword(req.user, req.body.password)) {
          User.findOne({ '_id' : req.user.id }, function(err, user) {
            if (err) {
              console.log(err);
              return false;
            }
            user.email = req.body.email;
            user.school = req.body.school;
            user.save();
            req.flash('accountSuccess', 'Successfully updated')
            redirect(res);
          });
        } else {
          req.flash('accountError', 'Incorrect password')
          redirect(res);
        }
      } else {
        req.flash('accountError', 'Are you logged in as the right user?')
        redirect(res);
      }
    } else if (req.body.action === 'update-password') {
      if (req.user.id === req.body.id) {
        if (isValidPassword(req.user, req.body.currentPassword)) {
          if (req.body.newPassword === req.body.newPasswordConfirm) {
            User.findOne({ '_id' : req.user.id }, function(err, user) {
              if (err) {
                console.log(err);
                return false;
              }
              user.password = createHash(req.body.newPassword);
              user.save();
              req.flash('passwordSuccess', 'Successfully updated password')
              redirect(res);
            });
          } else {
            req.flash('passwordError', 'Passwords do not match')
            redirect(res);
          }
        } else {
          req.flash('passwordError', 'Incorrect password')
          redirect(res);
        }
      } else {
        req.flash('passwordError', 'Are you logged in as the right user?')
        redirect(res);
      }
    } else {
      req.flash('accountError', 'An unknown error occurred.')
      redirect(res);
    }
  },
  adminUpdate: function(req, res, redirect) {
    if (req.user.role === 'admin') {
      if (req.body.action === 'edit') {
        User.findOne({ '_id' : req.body.id }, function(err, user) {
          if (err) {
            console.log(err);
            redirect(res);
          }
          user.username = req.body.username;
          user.email = req.body.email;
          user.school = req.body.school;
          user.save();
          redirect(res);
        });
      } else if (req.body.action === 'delete') {
          User.remove({ '_id' : req.body.id }, function(err) {
            if (err) {
              console.log(err);
              redirect(res);
            }
            redirect(res);
          });
        } else {
          redirect(res);
        }
      } else {
        redirect(res);
      }
    }
}
