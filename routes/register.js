var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../utils/db.js')
var sha1 = require('sha1');

router.get('/', function (req, res, next) {
    res.render('register');
});

router.post('/', function (req, res, next) {

    if (req.body.password === req.body.password2) {
        var newusr = new User({
            "username": req.body.username,
            "password": sha1(req.body.password),
            "email": req.body.email
        });
        newusr.save(function (err, data) {
            if (err) return console.error(err);
            let userToUpdate = data._id;
        });
    } else {
        res.render('index', {
            title: "BŁĄD",
            body: 'Podane hasła nie są identyczne!'
        });
    }


});

module.exports = router;