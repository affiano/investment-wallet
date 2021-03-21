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
                type: Sequelize.FLOAT,
                allowNull: false,
                defaultValue: 0
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
                type: Sequelize.FLOAT,
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
            paymentOrderId: {
                type: Sequelize.STRING
            },
            paymentId: {
                type: Sequelize.STRING
            },
            signature: {
                type: Sequelize.STRING
            },
            fundOrderId: {
                type: Sequelize.BIGINT(20)
            }
        }),
        Order: sequelize.define('order', {
            id: {
                type: Sequelize.BIGINT(20),
                primaryKey: true
            },
            userId: {
                type: Sequelize.BIGINT(20),
                allowNull: false
            },
            schemeCode: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            unit: {
                type: Sequelize.FLOAT,
                allowNull: false
            },
            buyValue: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            sellValue: {
                type: Sequelize.INTEGER
            },
            active: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
            }
        })
    };
};