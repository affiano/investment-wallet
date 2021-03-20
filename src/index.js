require('./config/process-config');
const { User, Transaction } = require('./db/connect');
require('./config/passport-config')({ User });
const { app } = require('./config/express-config')();
require('./route')({ app, User, Transaction });
require('./server')({ app });