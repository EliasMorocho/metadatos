// authController.js
const express = require('express');
const authController = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
    (username, password, done) => {
        console.log(username, password);
        if (username === 'admin' && password === '123') {
            return done(null, { username: 'admin' });
        } else {
            console.log(username, password);
            return done(null, false, { message: 'Credenciales incorrectas error' });
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.username);
});

passport.deserializeUser((username, done) => {
    done(null, { username });
});

authController.get('/login', (req, res) => {
    res.render('login');
});

authController.post('/login', (req, res, next) => {
    console.log(req.body);
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('/auth/login?error=' + encodeURIComponent(info.message));
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.redirect('/');
        });
    })(req, res, next);
});

authController.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/auth/login');
    });
});


module.exports = authController;
