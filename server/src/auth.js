const express = require('express'),
    { OAuth2Client } = require('google-auth-library'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    GoogleStrategy = require('passport-custom').Strategy,
    { GoogleUser, User, LocalUser } = require('./models/user');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
passport.use('google', new GoogleStrategy(async (req, done) => {
    try {
        const ticket = await client.verifyIdToken({
            idToken: req.body.idToken,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        let user = await GoogleUser.findOne({ googleId: payload.sub });
        if (!user) {
            user = await GoogleUser.create({
                googleId: payload.sub,
                firstName: payload.given_name,
                lastName: payload.family_name,
            });
        }
        done(null, user);
    } catch (err) {
        done(err);
    }
}));
passport.use('local', new LocalStrategy(async (username, password, done) => {
    try {
        const user = await LocalUser.findOne({ username });
        if (!user) { return done(null, false); }
        const passwordMatch = await user.comparePassword(password);
        done(null, passwordMatch && user);
    } catch (err) {
        done(err);
    }
}))
passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser((id, done) => User.findById(id, done));

const app = express.Router();
app
    .get('/me', (req, res) => res.json(req.user))
    .get('/logout', (req, res) => {
        req.logout();
        res.sendStatus(200);
    })
    .post('/google', passport.authenticate('google'))
    .post('/login', passport.authenticate('local'))
    .post('/register', async (req, res, next) => {
        const user = await LocalUser.create(req.body);
        req.login(user, err => {
            if (err) return next(err);
            res.json(user);
        });
    })
    .use((req, res) => res.sendStatus(req.isAuthenticated() ? 200 : 401))


module.exports = app;