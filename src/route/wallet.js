const { checkAuthenticated, checkNotAuthenticated } = require('./../lib/middleware');

module.exports = ({ app, walletService, User }) => {
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
            res.redirect('/');
            // return res.status(400).send({ errorMessage: error });
        });
    });

    app.post('/generate-order-id', checkAuthenticated, (req, res) => {
        walletService.generateOrderId({ body: req.body }).then(response => {
            console.log('generateOrderId service response:', response);
            res.status(200).send(response);
        }).catch(error => {
            console.error(error);
            res.status(400).send({ errorMessage: error });
        });
    });

    app.post('/verify-payment', checkAuthenticated, (req, res) => {
        walletService.verifyPayment({ body: req.body }).then(response => {
            console.log('verifyPayment service response:', response);
            res.status(200).send({ status: true });
        }).catch(error => {
            console.error(error);
            res.status(400).send({ errorMessage: error });
        });
    });

    app.post('/load-amount', checkAuthenticated, (req, res) => {
        walletService.loadAmount({ User, user: req.user, amountToAdd: req.body.amount }).then(response => {
            console.log('loadAmount service response:', response);
            res.status(200).send(response.toString());
        }).catch(error => {
            console.error(error);
            res.status(400).send({ errorMessage: error });
        });
    });

    app.post('/withdraw-amount', checkAuthenticated, (req, res) => {
        walletService.withdrawAmount({ User, user: req.user, amountToDeduct: Number(req.body.amount) }).then(response => {
            console.log('withdrawAmount service response:', response);
            res.status(200).send(response.toString());
        }).catch(error => {
            console.error(error);
            res.status(400).send({ errorMessage: error });
        });
    });
};