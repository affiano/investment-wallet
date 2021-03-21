require('./config/process-config');
const { User, Transaction, Order } = require('./db/connect');
require('./config/passport-config')({ User });
const { app } = require('./config/express-config')();
require('./route')({ app, User, Transaction, Order });
require('./server')({ app });