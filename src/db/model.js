const Sequelize = require('sequelize');

module.exports = ({ sequelize }) => {
    return {
        User: sequelize.define('user', {
            id: {
                type: Sequelize.BIGINT(20),
                primaryKey: true
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false
            },
            amount: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: '0'
            }
        }),
        Transaction: sequelize.define('transaction', {
            id: {
                type: Sequelize.BIGINT(20),
                primaryKey: true
            },
            amount: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            currency: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: 'INR'
            },
            userId: {
                type: Sequelize.BIGINT(20),
                allowNull: false
            }
        })
    }
};