const { userService, walletService, mfService } = require('./../service');

module.exports = ({ app, User, Transaction, Order }) => {
    require('./user')({ app, userService, User });
    require('./wallet')({ app, walletService, User, Transaction });
    require('./mf')({ app, mfService, Order, walletService, User, Transaction });
};