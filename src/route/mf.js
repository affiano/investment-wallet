const { checkAuthenticated } = require('./../lib/middleware');

module.exports = ({ app, mfService, Order, walletService, User, Transaction }) => {
    app.get('/buy-fund', checkAuthenticated, (req, res) => {
        res.render('mf.ejs');
    });

    app.get('/orders', checkAuthenticated, (req, res) => {
        res.render('orders.ejs');
    });

    app.get('/get-orders', checkAuthenticated, (req, res) => {
        mfService.getOrders({ Order, user: req.user }).then(response => {
            console.log('getOrders service response:', response);
            res.status(200).send({ data: response });
        }).catch(error => {
            console.error(error);
            res.status(400).send({ errorMessage: JSON.stringify(error) });
        });
    });

    app.get('/get-mf-data', checkAuthenticated, (req, res) => {
        mfService.getMFData().then(response => {
            console.log('getMFData service response:', response);
            res.status(200).send({ data: response });
        }).catch(error => {
            console.error(error);
            res.status(400).send({ errorMessage: JSON.stringify(error) });
        });
    });

    app.post('/buy-fund', checkAuthenticated, (req, res) => {
        mfService.buyFund({ body: req.body, Order, user: req.user, walletService, User, Transaction }).then(response => {
            console.log('buyFund service response:', response);
            res.status(200).send({ data: response });
        }).catch(error => {
            console.error(error);
            res.status(400).send({ errorMessage: JSON.stringify(error) });
        });
    });

    app.post('/sell-fund', checkAuthenticated, (req, res) => {
        mfService.sellFund({ body: req.body, Order, user: req.user, walletService, User, Transaction }).then(response => {
            console.log('sellFund service response:', response);
            res.status(200).send({ data: response });
        }).catch(error => {
            console.error(error);
            res.status(400).send({ errorMessage: JSON.stringify(error) });
        });
    });
};