const authResolve = require('./userAuth');
const serviceResolve = require('./services');
const bookingResolve = require('./booking');

const rootResolve = {
    ...authResolve,
    ...serviceResolve,
    ...bookingResolve,
};

module.exports = rootResolve;