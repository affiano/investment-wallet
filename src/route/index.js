const { userService, walletService } = require('./../service');

module.exports = ({ app, User, Transaction }) => {
    require('./user')({ app, userService, User });
    require('./wallet')({ app, walletService, User, Transaction });
};