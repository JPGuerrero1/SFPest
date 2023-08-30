const Service = require('../../models/service');
const User = require('../../models/user');
const {dateToISO} = require('../../dateResolve/date');

const services = async serviceIds => {
    try {
    const services = await Service.find({_id: {$in: serviceIds}})
         return services.map(service => {
            return Refactor(service);
        });
    } catch (err) {
        throw err;
    };
};

const singleService = async eventId => {
    try {
        const event = await Service.findById(eventId);
        return Refactor(event);
    } catch (err) {
        throw err;
    }
}

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

const Refactor = refact => {
    return {
       ...refact._doc,
       _id: refact.id,
       date: dateToISO(refact._doc.date),
       creator: user.bind(this, refact.creator)
   };
};

const bookRefactor = booking => {
    return {
        ...booking._doc,
        _id: booking.id,
        user: user.bind(this, booking._doc.user),
        event: singleService.bind(this, booking._doc.event),
        createdAt: dateToISO(booking._doc.createdAt),
        updatedAt: dateToISO(booking._doc.createdAt)
    };
};

exports.Refactor = Refactor;
exports.bookRefactor = bookRefactor;
