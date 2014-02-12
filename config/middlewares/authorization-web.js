'use strict';

exports.requiresLogin = function(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.redirect('/signin');
    }
    next();
};