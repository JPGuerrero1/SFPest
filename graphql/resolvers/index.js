const Service = require("../../models/service");
const User = require("../../models/user");
const bcrypt = require('bcryptjs');

const services = async serviceIds => {
    try {
    const services = await Service.find({_id: {$in: serviceIds}})
        services.map(service => {
            return {
            ...service._doc,
            date: new Date(service._doc.date).toISOString(),
            creator: user.bind(this, service.creator)};
        });
        return services;
    } catch (err) {
        throw err;
    };
};

const user = async userId => {
    try {
    const user = await User.findById(userId)
        return {
            ...user._doc,
             _id: user.id, 
            appointments: services.bind(this, user._doc.appointments
        )};
    } catch (err) {
        throw err;
    }
};

module.exports = {
    services: async () => {
        try {
       const services = await Service.find()
            return services.map(service => {
                return {
                    ...service._doc,
                    date: new Date(service._doc.date).toISOString(),
                    creator: user.bind(this, service._doc.creator)
                };
            });
        } catch(err) {
            throw err;
        };
    },

    createServices: async args => {
       const service = new Service({
        title: args.serviceInput.title,
        description: args.serviceInput.description,
        price: +args.serviceInput.price,
        date: new Date(args.serviceInput.date),
        creator: '64ed2a521883294619afa24e'
       });

       let appointment;

       try {
       const result = await service.save()

        appointment = {...result._doc, 
            date: new Date(service._doc.date).toISOString(),
            creator: user.bind(this, result._doc.creator
        )};
        const creator = await User.findById('64ed2a521883294619afa24e');

        if (!creator) {
            throw new Error('User not found.');
        }
        creator.appointments.push(service);
        await creator.save();
        return appointment;

        } catch(err) {
            throw err;
        };
    },

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
        
    }
};