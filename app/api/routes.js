'use strict';

var mongoose = require('mongoose'),
    async = require('async'),
    Route = mongoose.model('Route'),
    Location = mongoose.model('Location');

function createLocations(route, user, done) {
    async.parallel([
        function createOrigin(done) {
            createLocation(route.origin, done);
        },
        function createDestination(done) {
            createLocation(route.destination, done);
        }
    ], done);

    function createLocation(location, done) {
        if (location instanceof mongoose.Types.ObjectId) {
            return done(null, location.id);
        }

        if (typeof location === 'object') {
            location = new Location(location);
            location.creator = user;
            return location.save(function (err) {
                done(err, location.id);
            });
        }

        done(null, location);
    }
}

exports.create = function (req, res) {
    var route = req.body;

    async.waterfall([
        function (done) {
            createLocations(route, req.user, done);
        },
        function createRoute(locations, done) {
            route.origin = locations[0];
            route.destination = locations[1];
            route.creator = req.user.id;
            route = new Route(route);

            route.save(function (err) {
                done(err, route);
            });
        }
    ], function (err, route) {
        if (err) {
            return res.jsonp(500, err);
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
    var route = req.body;

    async.waterfall([
        function (done) {
            createLocations(route, req.user, done);
        },
        function updateRoute(locations, done) {
            route.origin = new mongoose.Types.ObjectId(locations[0]);
            route.destination = new mongoose.Types.ObjectId(locations[1]);
            req.routeparam.update(route, done);
        }
    ], function (err) {
        if (err) {
            res.jsonp(500, err);
        }
        else {
            Route.load(req.routeparam._id, function (err, route) {
                if (err) {
                    return res.jsonp(500, err);
                }

                return res.jsonp(route);
            });
        }
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