const Sequelize = require('sequelize');
const sequelize = new Sequelize('sys', 'root', 'password', {
    host: 'localhost',
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