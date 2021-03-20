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
            userId: {
                type: Sequelize.BIGINT(20),
                allowNull: false
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
            type: {
                type: Sequelize.STRING,
                allowNull: false
            },
            orderId: {
                type: Sequelize.STRING
            },
            paymentId: {
                type: Sequelize.STRING
            },
            signature: {
                type: Sequelize.STRING
            }
        })
    }
};