'use strict';

var mongoose = require('mongoose'),
    Route = mongoose.model('Route'),
    _ = require('underscore');

exports.create = function (req, res) {
    var route = new Route(req.body);
    route.creator = req.user;

    route.save(function (err) {
        if (err) {
            return jsonp(500, err);
        }
        else {
            Route.load(route._id, function (err, route) {
                if (err) {
                    res.jsonp(500, err);
                }
                else {
                    res.jsonp(route);
                }
            });
        }
    });
};

exports.update = function (req, res) {
    var whitelist = _.pick(req.body, 'title', 'origin', 'destination', 'description');
    var route = _.extend(req.routeparam, whitelist);

    route = _.extend(route, req.body);

    route.save(function () {
        res.jsonp(route);
    });
};

exports.deactivate = function (req, res) {
    var route = req.routeparam;

    route.deactivate(function (err) {
        if (err) {
            res.jsonp(500, err);
        }
        else {
            res.jsonp(route);
        }
    });
};

exports.show = function (req, res) {
    res.jsonp(req.routeparam);
};

exports.search = function (req, res) {
    Route.search(req.query, function (err, routes) {
        if (err) {
            res.jsonp(500, err);
        }
        else {
            res.jsonp(routes);
        }
    });
};

exports.route = function (req, res, next, id) {
    Route.load(id, function (err, route) {
        if (err) {
            return next(err);
        }
        if (!route) {
            return next(new Error('Failed to load route ' + id));
        }
        req.routeparam = route;
        next();
    });
};