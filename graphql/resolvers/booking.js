const Service = require('../../models/service');
const Booking = require('../../models/booking');
const {Refactor, bookRefactor} = require('./populationFunc');

module.exports = {

    bookings: async (args, req) => {

        if (!req.isAuth) {
            throw new Error('Unauthenticated.');
        }

        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return bookRefactor(booking);
            });
        } catch (err) {
            throw err;
        }
    },

    bookEvent: async args => {
        const fetchedEvent = await Service.findOne({_id: args.eventId})
        const booking = new Booking({
            user: req.userId,
            event: fetchedEvent
        });
        const result = await booking.save();
        return bookRefactor(result);
        
    },
    
    cancelBooking: async (args, req) => {

        if (!req.isAuth) {
            throw new Error('Unauthenticated.');
        }

        try {
            const booking = await Booking.findById(args.bookingId).populate('event');
            const event = Refactor(booking.event);

            await Booking.deleteOne({_id: args.bookingId});
            return event;
        } catch (err) {
            throw err;
        }
    }
};