const session = require('express-session');
const methodOverride = require('method-override');
const express = require('express');
const app = express();
const passport = require('passport');

module.exports = () => {
    app.set('view-engine', 'ejs');
    app.use(express.urlencoded({ extended: false }));
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(methodOverride('_method'));
    return { app };
};