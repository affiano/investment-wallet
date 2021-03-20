const Razorpay = require('razorpay');
const crypto = require('crypto');

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

    generateOrderId: async ({ body }) => new Promise((resolve, reject) => {
        try {
            amountToAdd = Number(body.amount);
            const rzp = new Razorpay({
                key_id: process.env.RAZORPAY_ID,
                key_secret: process.env.RAZORPAY_SECRET
            });
            const options = {
                amount: amountToAdd * 100,  // amount in the smallest currency unit
                currency: 'INR',
                receipt: Date.now().toString(),
                payment_capture: '1'
            };
            rzp.orders.create(options, async (err, order) => {
                if (err) {
                    return reject(err);
                }
                console.log(order);
                resolve(order);
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

    loadAmount: async ({ User, user, amountToAdd }) => new Promise(async (resolve, reject) => {
        try {
            amountToAdd = Number(amountToAdd);
            user = await User.findOne({
                where: {
                    id: user.id
                }
            });
            await user.update({
                amount: user.amount + amountToAdd
            });
            resolve(user.amount);
        } catch (e) {
            return reject(e);
        }
    }),

    withdrawAmount: async ({ User, user, amountToDeduct }) => new Promise(async (resolve, reject) => {
        try {
            amountToDeduct = Number(amountToDeduct);
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
            resolve(user.amount);
        } catch (e) {
            return reject(e);
        }
    })
};