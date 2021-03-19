const { checkAuthenticated, checkNotAuthenticated } = require('./../lib/middleware');

module.exports = ({ app, walletService, User }) => {
    app.get('/wallet', checkAuthenticated, (req, res) => {
    });

    app.post('/check-balance', checkAuthenticated, (req, res) => {
        walletService.getAmount({ User, user: req.user }).then(response => {
            console.log('getAmount service response:', response);
            res.render('wallet.ejs', {
                data: {
                    name: req.user.name,
                    amount: response
                }
            });
        }).catch(error => {
            console.error(error);
            res.redirect('/signup');
            // return res.status(400).json({ errorMessage: error });
        });
    });

    app.post('/load-amount', checkAuthenticated, (req, res) => {
        walletService.loadAmount({ User, user: req.user, amountToAdd: Number(req.body.amount) }).then(response => {
            console.log('loadAmount service response:', response);
            res.render('wallet.ejs', {
                data: {
                    name: req.user.name,
                    amount: response
                }
            });
        }).catch(error => {
            console.error(error);
            res.redirect('/signup');
            // return res.status(400).json({ errorMessage: error });
        });
    });

    app.post('/withdraw-amount', checkAuthenticated, (req, res) => {
        walletService.withdrawAmount({ User, user: req.user, amountToDeduct: Number(req.body.amount) }).then(response => {
            console.log('withdrawAmount service response:', response);
            res.render('wallet.ejs', {
                data: {
                    name: req.user.name,
                    amount: response
                }
            });
        }).catch(error => {
            console.error(error);
            res.redirect('/signup');
            // return res.status(400).json({ errorMessage: error });
        });
    });
};