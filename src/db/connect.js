const Sequelize = require('sequelize');

const dbhost = process.env.NODE_ENV === 'production' ? process.env.PROD_MySQL_HOST : process.env.LOCAL_MySQL_HOST;
const schema = process.env.NODE_ENV === 'production' ? process.env.PROD_MySQL_SCHEMA : process.env.LOCAL_MySQL_SCHEMA;
const dbusername = process.env.NODE_ENV === 'production' ? process.env.PROD_MySQL_USERNAME : process.env.LOCAL_MySQL_USERNAME;
const dbpassword = process.env.NODE_ENV === 'production' ? process.env.PROD_MySQL_PASSWORD : process.env.LOCAL_MySQL_PASSWORD;

const sequelize = new Sequelize(schema, dbusername, dbpassword, {
    host: dbhost,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

sequelize.sync().then(() => {
    console.log('Connected to MySQL');
});

module.exports = require('./model')({ sequelize });