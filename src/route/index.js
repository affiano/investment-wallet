const { userService, walletService } = require('./../service');

module.exports = ({ app, User }) => {
    require('./user')({ app, userService, User });
    require('./wallet')({ app, walletService, User });
};