const webToken = require('jsonwebtoken');
const { rawListeners } = require('../models/user');

module.exports = (req, res, next) => {

    const authHead = req.get('Authorization');
    if (!authHead) {
        req.isAuth = false;
        return next();
    }

    const token = authHead.split(' ')[1];
    if (!token || token === '') {
        req.isAuth = false;
        return next();
    }

    let decodedToken;
    try {
        decodedToken = webToken.verify(token, 'keypass');
    } catch (err) {
        req.isAuth = false;
        return next();
    };

    if (!decodedToken) {
        req.isAuth = false;
        return next();
    }

    req.isAuth = true;
    req.userId = decodedToken.userId;
    next();
};