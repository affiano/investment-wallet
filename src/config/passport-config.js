const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { passportService } = require('./../service');

module.exports = ({ User }) => {
    passport.use(new LocalStrategy(
        { usernameField: 'email' },
        passportService.authenticateUser({ User })
    ));

    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id, done) => done(null, await User.findOne({
        where: {
            id
        }
    })));
};