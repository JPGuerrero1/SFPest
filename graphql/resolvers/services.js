const Service = require("../../models/service");
const User = require('../../models/user');
const {Refactor} = require('./populationFunc');

module.exports = {
    services: async () => {
        try {
       const services = await Service.find()
            return services.map(service => {
                return Refactor(service);
            });
        } catch(err) {
            throw err;
        };
    },

    createServices: async (args,req) => {

        if (!req.isAuth) {
            throw new Error('Unauthenticated.');
        }

       const service = new Service({
        title: args.serviceInput.title,
        description: args.serviceInput.description,
        price: +args.serviceInput.price,
        date: new Date(args.serviceInput.date),
        creator: req.userId
       });

       let appointment;

       try {
       const result = await service.save()

        appointment = Refactor(result);

        const creator = await User.findById(req.userId);

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
    
};