var express = require('express');
var router = express.Router();

var sha1 = require('sha1');
var User = require('../utils/db.js')
var gmailTransporter = require('../utils/mailerTransporter.js');


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

router.get('/', function (req, res) {
  User.find(function (err, data) {
    if (err) return console.error(err);
    console.log(data);
    res.json(data);
  })
});

router.get('/reset', function (req, res, next) {
  User.remove({}, function (err) {
    if (err) return handleError(err);
    var admin = new User({
      "username": "admin",
      "password": sha1("stud234"),
      "admin": true,
      "email": "admin@test.pl",
      "active": true
    });
    var asdf = new User({
      "username": "asdf",
      "password": sha1("asdf"),
      "email": "web20@t.pl"
    });
    var userBezMaila = new User({
      "username": "bezMaila",
      "password": sha1("bezMaila"),
      "email": "brak"
    });

    // create two users: 'admin' and 'asdf'
    admin.save((err, data) => {
      if (err) return console.error(err);
      asdf.save(function (err, data2) {
        if (err) return console.error(err);
        userBezMaila.save(function (err, data3) {
          if (err) return console.error(err);
          res.render('info', {
            title: 'Users created!',
            data: {
              data,
              data2,
              data3
            }
          });
        })
      });
    });
  });
});

module.exports = router;