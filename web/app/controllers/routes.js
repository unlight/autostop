'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Route = mongoose.model('Route'),
    _ = require('underscore');
/**
 * Create a route
 */
exports.create = function (req, res) {
    var route = new Route(req.body);
    console.log('req.user=', req.user);
    route.creator = req.user;

    route.save(function (err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                route: route
            });
        } else {
            res.jsonp(route);
        }
    });
};

/**
 * Update a route
 */
exports.update = function (req, res) {
    var whitelist = _.pick(req.body, 'title', 'origin', 'destination', 'description');
    var route = _.extend(req.routeparam, whitelist);

    route = _.extend(route, req.body);

    route.save(function () {
        res.jsonp(route);
    });
};

/**
 * Deactivate a route
 */
exports.deactivate = function (req, res) {
    var route = req.routeparam;

    route.deactivate(function (err) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(route);
        }
    });
};

/**
 * Show a route
 */
exports.show = function (req, res) {
    res.jsonp(req.routeparam);
};


/**
 * Find route by id
 */
exports.route = function (req, res, next, id) {
    Route.load(id, function (err, route) {
        if (err) return next(err);
        if (!route) return next(new Error('Failed to load route ' + id));
        req.routeparam = route;
        next();
    });
};

/**
 * List of routes
 */
exports.search = function (req, res) {
    Route.search(req.query, function (err, routes) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(routes);
        }
    });
};