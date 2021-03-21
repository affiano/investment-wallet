const { checkAuthenticated } = require('./../lib/middleware');

module.exports = ({ app, walletService, User, Transaction, sequelize }) => {
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
            // return res.status(400).send({ errorMessage: JSON.stringify(error) });
        });
    });

    app.get('/transactions', checkAuthenticated, (req, res) => {
        res.render('transactions.ejs');
    });

    app.get('/get-transactions', checkAuthenticated, (req, res) => {
        walletService.getTransactions({ Transaction, user: req.user }).then(response => {
            console.log('getTransactions service response:', response);
            res.status(200).send({ data: response });
        }).catch(error => {
            console.error(error);
            res.status(400).send({ errorMessage: JSON.stringify(error) });
        });
    });

    app.post('/generate-order-id', checkAuthenticated, (req, res) => {
        walletService.generateOrderId({ body: req.body, user: req.user, Transaction, transactionId: req.body.transactionId }).then(response => {
            console.log('generateOrderId service response:', response);
            res.status(200).send(response);
        }).catch(error => {
            console.error(error);
            res.status(400).send({ errorMessage: JSON.stringify(error) });
        });
    });

    app.post('/verify-payment', checkAuthenticated, (req, res) => {
        walletService.verifyPayment({ body: req.body }).then(response => {
            console.log('verifyPayment service response:', response);
            res.status(200).send({ status: true });
        }).catch(error => {
            console.error(error);
            res.status(400).send({ errorMessage: JSON.stringify(error) });
        });
    });

    app.post('/load-amount', checkAuthenticated, (req, res) => {
        walletService.loadAmount({ User, Transaction, user: req.user, body: req.body, sequelize }).then(response => {
            console.log('loadAmount service response:', response);
            res.status(200).send(response);
        }).catch(error => {
            console.error(error);
            res.status(400).send({ errorMessage: JSON.stringify(error) });
        });
    });

    app.post('/withdraw-amount', checkAuthenticated, (req, res) => {
        walletService.withdrawAmount({ User, Transaction, user: req.user, body: req.body, sequelize }).then(response => {
            console.log('withdrawAmount service response:', response);
            res.status(200).send(response);
        }).catch(error => {
            console.error(error);
            res.status(400).send({ errorMessage: JSON.stringify(error) });
        });
    });
};