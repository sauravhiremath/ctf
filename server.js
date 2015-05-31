// current todo: password changing

var express = require('express'),
    exphbs = require('express-handlebars'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    mongoose = require('mongoose'),
    flash = require('connect-flash')
    session = require('express-session'),
    passport = require('passport'),
    LocalStrategy = require('passport-local');

var app = express();

// config express
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));
// prevent caching
app.disable('etag');

// set up auth and db
var dbconfig = require('./config/database');
mongoose.connect(dbconfig.url);
var auth = require('./config/passport')(passport);
app.use(flash());
app.use(session({secret: 'verysecret', saveUninitialized: true, resave: true}));
app.use(passport.initialize());
app.use(passport.session());

// config handlebars
var hbs = exphbs.create({
  defaultLayout: 'main',
  helpers: {
    increment: function(val, options) {
      return parseInt(val, 10) + 1;
    },
    equal: function(a,b,options) {
      if (a === b) {
        return options.fn(this);
      }
      return options.inverse(this);
    },
    date: function (timestamp, options) {
      var date = new Date(timestamp);
      return date.toLocaleString();
    },
    isAdmin: function(user, options) {
      if (!user) {
        return options.inverse(this);
      } else if (user.role === 'admin') {
        return options.fn(this);
      }
      return options.inverse(this);
    },
    isSolved: function(user, challenge, options) {
      if (!user) {
        return options.inverse(this);
      } else if (user.solved.indexOf(challenge.id) !== -1) {
        return options.fn(this);
      }
      return options.inverse(this);
    }
  }
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// set up user and challenge methods
var challengeMethods = require('./config/challenges');
var userMethods = require('./config/users');

// routes

// serve static files from public dir
app.use(express.static(__dirname + '/public'));

// basic routes
app.get('/', function(req, res) {
  res.render('home', {user: req.user})
});
app.get('/account', function(req, res) {
  var flashMessages = {
    accountSuccess: req.flash('accountSuccess'),
    accountError: req.flash('accountError'),
    passwordSuccess: req.flash('passwordSuccess'),
    passwordError: req.flash('passwordError')
  };
  res.render('account', {user: req.user, flashMessages: flashMessages})
});
app.post('/account', function(req, res) {
  userMethods.update(req, res, redirect);
  function redirect(res) {
    res.redirect('/account');
  }
});
app.get('/faq', function(req, res) {
  res.render('faq', {user: req.user});
});

// ctf routes
app.get('/play', function(req, res) {
  challengeMethods.get(sortAndPassChallenges);
  function sortAndPassChallenges(challenges) {
    challenges.sort(function(a,b) {
      return a.index - b.index;
    });
    res.render('play', {user: req.user, challenges: challenges, challenge: req.session.challenge});
    req.session.challenge = null;
  }
});
app.post('/play', function(req, res) {
  if (!req.user) {
    res.redirect('/play');
  } else {
    challengeMethods.verify(req, res, redirect);
    function redirect(res) {
      res.redirect('/play#challenge-' + req.body.id);
    }
  }
});
app.get('/scoreboard', function(req, res) {
  userMethods.get(sortAndPassUsers);
  function sortAndPassUsers(users) {
    var normalUsers = users.filter(function(user) {
      return user.role !== 'admin';
    });
    normalUsers.sort(function(a,b) {
      if (b.points - a.points === 0) {
        return a.lastSolved - b.lastSolved;
      } else {
        return b.points - a.points;
      }
    });
    res.render('scoreboard', {user: req.user, users: normalUsers});
  }
});

// admin routes
app.get('/admin', function(req, res, next) {
  res.render('admin', {user: req.user})
});
app.get('/admin-challenges', function(req, res) {
  challengeMethods.get(sortAndPassChallenges);
  function sortAndPassChallenges(challenges) {
    challenges.sort(function(a,b) {
      return a.index - b.index;
    });
    res.render('admin-challenges', {user: req.user, challenges: challenges, challenge: req.session.challenge});
    req.session.challenge = null;
  }
});
app.post('/admin-challenges', function(req, res) {
  if (!req.user) {
    res.redirect('/admin-challenges');
  } else if (req.body.action === 'edit') {
    challengeMethods.update(req, res, redirect);
    function redirect(res) {
      res.redirect('/admin-challenges#challenge-' + req.session.challenge);
    }
  } else if (req.body.action === 'add') {
    challengeMethods.add(req, res, redirect);
    function redirect(res) {
      res.redirect('/admin-challenges');
    }
  } else if (req.body.action === 'delete') {
    challengeMethods.remove(req, res, redirect);
    function redirect(res) {
      res.redirect('/admin-challenges');
    }
  }
});
app.get('/admin-users', function(req, res) {
  userMethods.get(passUsers);
  function passUsers(users) {
    res.render('admin-users', {user: req.user, users: users});
    req.session.challenge = null;
  }
});
app.post('/admin-users', function(req, res) {
  userMethods.adminUpdate(req, res, redirect);
  function redirect(res) {
    res.redirect('/admin-users');
  }
});

// auth routes
app.get('/register', function(req, res) {
  res.render('register', {
    signupMessage: req.flash('signupMessage')
  })
});
app.get('/login', function(req, res) {
  res.render('login', {
    loginMessage: req.flash('loginMessage')
  })
});
app.post('/register', passport.authenticate('signup', {
    successRedirect: '/',
    failureRedirect: '/register',
    failureFlash: true
  })
);
app.post('/login', passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })
);
app.get('/logout', function(req, res) {
  if (!req.user) {
    res.redirect('/');
  } else if (req.user) {
    console.log('Logging out ' + req.user.username);
    req.logout();
    res.redirect('/');
  }
});

// port
var port = process.env.PORT || 8080;
app.listen(port);
console.log('localhost:' + port + ' - be there');
