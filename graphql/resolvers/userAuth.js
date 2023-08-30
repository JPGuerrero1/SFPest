const User = require("../../models/user");
const bcrypt = require('bcryptjs');
const webToken = require('jsonwebtoken');

module.exports = {

    createUser: async args => {
        try {
        const existingUser = await User.findOne({email: args.userInput.email})
        
            if (existingUser) {
                throw new Error('User already exists.')
            };

            const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
        
            const user = new User({
                email: args.userInput.email,
                password: hashedPassword
            });

            const result = await user.save();

            return {...result._doc, password:null, _id: result.id};
        } catch(err) {
            throw err
        };
    },

    login: async ({email, password}) => {
        const user = await User.findOne({email: email});
        if (!user) {
            throw new Error('User does not exist.');
        }
        const Equalpass = await bcrypt.compare(password, user.password);
        if (!Equalpass) {
            throw new Error('Password is incorrect.');
        }
        const token = webToken.sign({userId: user.id, email: user.email}, 'keypass', {
            expiresIn: '1h'
        });
        return {userId: user.id, token: token, tokenExp: 1};
    }
};