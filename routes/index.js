var express = require('express');
var router = express.Router();

var passport = require('passport');

var User = require('../utils/db.js')
var gmailTransporter = require('../utils/mailerTransporter.js');

router.get('/', function (req, res, next) {
  res.render('index', {
    title: "Secure Application",
    body: "To view resources please login.."
  });
});

router.get('/logged', function (req, res, next) {
  var dane = {
    user: req.user,
    passport: req.session.passport,
    log_info: res.locals.logInfo
  };
  res.render('logged', dane);
});

router.get('/signin', function (req, res, next) {
  var mess = `
    <h3>Please Sign In</h3>
  `;
  res.send(mess);
});

router.get('/login', function (req, res) {
  res.render('login');
});

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

router.post('/login',
  passport.authenticate('local', {
    session: true,
    successRedirect: '/',
    failureRedirect: '/login'
  })
);

router.get('/wazne-dane', checkAuthentication, function (req, res) {
  data = {
    title: 'Secured Data',
    body: 'Congratulations you have access to very important data.'
  }
  res.render('index', data);
});



function checkAuthentication(req, res, next) {
  console.log('sprawdzam');
  if (req.isAuthenticated()) {
    console.log('JEST OK');
    // if user is looged in, req.isAuthenticated() will return true
    next();
  } else {
    console.log('nie jest ok');
    res.redirect("/login");
  }
}

router.get('/session',checkAuthentication, function (req, res, next) {
  if (req.session.odwiedziny) {
    req.session.odwiedziny++;
  } else {
    req.session.odwiedziny = 1;
  }
  var dane = {
    idSesji: req.session.id,
    odwiedziny: req.session.odwiedziny,
    ciasteczko: req.session.cookie,
    data: req.session.cookie.data,
    passport: req.session.passport
  };
  res.render('session', dane);
});

module.exports = router;