const Service = require("../../models/service");
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

    createServices: async args => {
       const service = new Service({
        title: args.serviceInput.title,
        description: args.serviceInput.description,
        price: +args.serviceInput.price,
        date: new Date(args.serviceInput.date),
        creator: '64ed553fedc07baf2042673c'
       });

       let appointment;

       try {
       const result = await service.save()

        appointment = Refactor(result);

        const creator = await User.findById('64ed553fedc07baf2042673c');

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