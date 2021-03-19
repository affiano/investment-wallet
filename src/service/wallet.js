const Razorpay = require('razorpay');

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

    loadAmount: async ({ User, user, amountToAdd }) => new Promise(async (resolve, reject) => {
        try {
            user = await User.findOne({
                where: {
                    id: user.id
                }
            });

            const rzp = new Razorpay({
                key_id: process.env.RAZORPAY_ID,
                key_secret: process.env.RAZORPAY_SECRET
            });
            const options = {
                amount: amountToAdd,  // amount in the smallest currency unit
                currency: "INR",
                receipt: Date.now().toString()
            };
            rzp.orders.create(options, async (err, order) => {
                if (err) {
                    return reject(err);
                }
                console.log(order);
                await user.update({
                    amount: user.amount + amountToAdd
                });
                resolve(user.amount);
            });
        } catch (e) {
            return reject(e);
        }
    }),

    withdrawAmount: async ({ User, user, amountToDeduct }) => new Promise(async (resolve, reject) => {
        try {
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