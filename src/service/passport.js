const bcrypt = require('bcrypt');

module.exports = {
    authenticateUser: ({ User }) => {
        return async (email, password, done) => {
            const user = await User.findOne({
                where: {
                    email
                }
            });
            if (!user) {
                const message = `No user found against Email: ${email}`;
                console.error(message);
                return done(null, false, { message });
            }
            let passwordMatched;
            try {
                passwordMatched = bcrypt.compareSync(password, user.password);
            } catch (e) {
                const errorMessage = e;
                console.error(errorMessage);
                return done(errorMessage);
            }
            if (!passwordMatched) {
                const message = `Password mismatch!`;
                console.error(message);
                return done(null, false, { message });
            }
            return done(null, user);
        };
    }
};