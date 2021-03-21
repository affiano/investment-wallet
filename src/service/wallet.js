const Razorpay = require('razorpay');
const crypto = require('crypto');
const { Op } = require('sequelize');

module.exports = {
    getAmount: async ({ User, user }) => new Promise(async (resolve, reject) => {
        try {
            user = await User.findOne({
                where: {
                    id: user.id
                }
            });
            resolve(user.amount);
        } catch (e) {
            return reject(e);
        }
    }),

    getTransactions: ({ Transaction, user }) => new Promise(async (resolve, reject) => {
        try {
            const transactions = await Transaction.findAll({
                where: {
                    userId: user.id,
                    [Op.or]: [
                        {
                            type: {
                                [Op.ne]: 'load'
                            }
                        },
                        {
                            paymentOrderId: {
                                [Op.not]: null
                            }
                        }
                    ]
                }
            });
            resolve(transactions);
        } catch (e) {
            return reject(e);
        }
    }),

    generateOrderId: async ({ body, user, Transaction }) => new Promise((resolve, reject) => {
        try {
            const currency = 'INR';
            amountToAdd = Number(Number(body.amount).toFixed(2));
            const rzp = new Razorpay({
                key_id: process.env.RAZORPAY_ID,
                key_secret: process.env.RAZORPAY_SECRET
            });
            const options = {
                amount: amountToAdd * 100,  // amount in the smallest currency unit
                currency,
                receipt: Date.now().toString(),
                payment_capture: '1'
            };
            rzp.orders.create(options, async (err, order) => {
                if (err) {
                    return reject(err);
                }
                console.log(order);
                const transactionId = Date.now();
                await Transaction.create({
                    id: transactionId,
                    userId: user.id,
                    amount: amountToAdd,
                    currency,
                    type: 'load',
                    paymentOrderId: order.id
                });
                resolve(Object.assign(order, {
                    transactionId
                }));
            });
        } catch (e) {
            return reject(e);
        }
    }),

    verifyPayment: async ({ body }) => new Promise((resolve, reject) => {
        try {
            const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET)
                .update(`${body.razorpay_order_id}|${body.razorpay_payment_id}`)
                .digest('hex');

            if (body.razorpay_signature === expectedSignature) {
                resolve(true);
            } else {
                reject(`Payment signature mismatch!`);
            }
        } catch (e) {
            return reject(e);
        }
    }),

    loadAmount: async ({ User, Transaction, user, body }) => new Promise(async (resolve, reject) => {
        try {
            amountToAdd = Number(Number(body.amount).toFixed(2));

            if (body.type === 'load') {
                const transaction = await Transaction.findOne({
                    where: {
                        id: body.transactionId
                    }
                });
                await transaction.update({
                    paymentId: body.razorpay_payment_id,
                    signature: body.razorpay_signature
                });
            }

            user = await User.findOne({
                where: {
                    id: user.id
                }
            });
            await user.update({
                amount: user.amount + amountToAdd
            });
            resolve({ amount: user.amount, transactionId: body.transactionId });
        } catch (e) {
            return reject(e);
        }
    }),

    withdrawAmount: async ({ User, Transaction, user, body }) => new Promise(async (resolve, reject) => {
        try {
            amountToDeduct = Number(Number(body.amount).toFixed(2));
            user = await User.findOne({
                where: {
                    id: user.id
                }
            });
            if (user.amount < amountToDeduct) {
                return reject(`Insufficient Balance!`);
            }
            await user.update({
                amount: user.amount - amountToDeduct
            });
            const transactionId = Date.now();
            const newTransaction = {
                id: transactionId,
                userId: user.id,
                amount: amountToDeduct,
                type: body.type || 'withdraw'
            };
            if (body.orderId) {
                newTransaction.fundOrderId = body.orderId;
            }
            await Transaction.create(newTransaction);
            resolve({ amount: user.amount, transactionId });
        } catch (e) {
            return reject(e);
        }
    })
};