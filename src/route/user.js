const passport = require('passport');
const { checkAuthenticated, checkNotAuthenticated } = require('./../lib/middleware');

module.exports = ({ app, userService, User }) => {
    app.get('/', checkAuthenticated, (req, res) => {
        console.log('/');
        res.render('index.ejs', {
            name: req.user.name
        });
    });

    app.get('/login', checkNotAuthenticated, (req, res) => {
        res.render('login.ejs');
    });

    app.post(
        '/login',
        checkNotAuthenticated,
        passport.authenticate('local', { failureRedirect: '/login' }),
        (req, res) => {
            res.redirect('/');
        }
    );

    app.get('/signup', checkNotAuthenticated, (req, res) => {
        res.render('signup.ejs');
    });

    app.post('/signup', checkNotAuthenticated, (req, res) => {
        userService.signup({ User, body: req.body }).then(response => {
            console.log('signup service response:', response);
            res.redirect('/login');
        }).catch(error => {
            console.error(error);
            res.redirect('/signup');
            // return res.status(400).json({ errorMessage: error });
        });
    });

    app.delete('/logout', checkAuthenticated, (req, res) => {
        req.logOut();
        res.render('login.ejs');
    });
};