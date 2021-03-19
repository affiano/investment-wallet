const bcrypt = require('bcrypt');

module.exports = {
    signup: async ({ User, body }) => new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({
                where: {
                    email: body.email.toLowerCase()
                }
            });
            if (user) {
                const errorMessage = `User already exists with Email: ${body.email.toLowerCase()}`;
                return reject(errorMessage);
            }
            const hashedPassword = bcrypt.hashSync(body.password, 10);
            const newUser = {
                id: Date.now(),
                name: body.name,
                email: body.email.toLowerCase(),
                password: hashedPassword,
                amount: 0
            };
            const res = User.create(newUser);
            resolve(res);
        } catch (e) {
            const errorMessage = e;
            return reject(errorMessage);
        }
    })
};