require('./config/process-config');
const { User } = require('./db/connect');
require('./config/passport-config')({ User });
const { app } = require('./config/express-config')();
require('./route')({ app, User });
require('./server')({ app });