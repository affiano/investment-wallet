const axios = require('axios');
const data = require('./../data/mf.js');

module.exports = {
    getMFData: () => new Promise(async (resolve, reject) => {
        try {
            const dataToResolve = [];
            for (let i = 0; i < data.ids.length; i++) {
                mfid = data.ids[i];
                let res;
                try {
                    res = await axios.get(`https://api.mfapi.in/mf/${mfid}`);
                    dataToResolve.push(res.data.meta);
                } catch (error) {
                    console.error(error);
                }
            }
            resolve(dataToResolve);
        } catch (e) {
            return reject(e);
        }
    }),

    getOrders: ({ Order, user }) => new Promise(async (resolve, reject) => {
        try {
            const orders = await Order.findAll({
                where: {
                    userId: user.id
                }
            });
            for (let i = 0; i < orders.length; i++) {
                const order = orders[i];
                let res;
                try {
                    res = await axios.get(`https://api.mfapi.in/mf/${order.schemeCode}`);
                } catch (error) {
                    console.error(error);
                    continue;
                }
                const nav = res.data.data[0].nav;
                const currentValue = Number((nav * order.unit).toFixed(2));
                order.dataValues.currentValue = currentValue;
            }
            resolve(orders);
        } catch (e) {
            return reject(e);
        }
    }),

    buyFund: ({ body, Order, user, walletService, User, Transaction }) => new Promise(async (resolve, reject) => {
        try {
            const amount = Number(Number(body.amount).toFixed(2));
            const orderId = Date.now();
            const withdrawRes = await walletService.withdrawAmount({ user, User, Transaction, body: { amount, orderId, type: 'buy' } });
            let res;
            try {
                res = await axios.get(`https://api.mfapi.in/mf/${body.schemeCode}`);
            } catch (error) {
                console.error(error);
                return reject(error);
            }
            const nav = res.data.data[0].nav;
            const unit = Number((amount / nav).toFixed(5));
            await Order.create({
                id: orderId,
                userId: user.id,
                schemeCode: body.schemeCode,
                unit,
                buyValue: amount,
                active: true
            });
            resolve({ orderId, transactionId: withdrawRes.transactionId, balance: withdrawRes.amount });
        } catch (e) {
            return reject(e);
        }
    }),

    sellFund: ({ body, Order, user, walletService, User, Transaction }) => new Promise(async (resolve, reject) => {
        try {
            const orderId = Number(body.fundOrderId);
            const order = await Order.findOne({
                where: {
                    id: orderId
                }
            });
            if (order.sellValue) {
                return reject(`Fund already sold!`);
            }

            let res;
            try {
                res = await axios.get(`https://api.mfapi.in/mf/${order.schemeCode}`);
            } catch (error) {
                console.error(error);
                return reject(error);
            }
            const nav = res.data.data[0].nav;
            const amount = Number((order.unit * nav).toFixed(2));
            await order.update({
                sellValue: amount,
                active: false
            });
            const transactionId = Date.now();
            await Transaction.create({
                id: transactionId,
                userId: user.id,
                amount,
                type: 'sell',
                fundOrderId: orderId
            });
            const loadRes = await walletService.loadAmount({ user, User, Transaction, body: { amount, type: 'sell' } });
            resolve({ orderId, transactionId: loadRes.transactionId, balance: loadRes.amount });
        } catch (e) {
            return reject(e);
        }
    })
};