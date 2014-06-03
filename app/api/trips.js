'use strict';

var mongoose = require('mongoose'),
    Trip = mongoose.model('Trip'),
    _ = require('underscore');

exports.search = function (req, res) {
    Trip.search(req.query, function (err, trips) {
        if (err) {
            res.jsonp(500, err);
        }
        else {
            res.jsonp(trips);
        }
    });
};

exports.create = function (req, res) {
    var trip = new Trip(req.body);
    trip.creator = req.user;

    trip.save(function (err) {
        if (err) {
            res.jsonp(401, err);
        }
        else {
            Trip.load(trip._id, function (err, trip) {
                if (err) {
                    res.jsonp(500, err);
                }
                else {
                    return res.jsonp(trip);
                }
            });
        }
    });
};

exports.show = function (req, res) {
    res.jsonp(req.trip);
};

exports.update = function (req, res) {
    var whitelist = _.pick(req.body, 'start', 'note');
    var trip = _.extend(req.trip, whitelist);

    trip.save(function () {
        res.jsonp(trip);
    });
};

exports.deactivate = function (req, res) {
    var trip = req.trip;
    trip.deactivate(function (err) {
        if (err) {
            res.jsonp(500, err);
        }
        else {
            res.jsonp(trip);
        }
    });
};

exports.join = function (req, res) {
    req.trip.join(req.user._id, function (err) {
        if (err) {
            return res.jsonp(500, err);
        }
        else {
            res.end();
        }
    });
};

exports.leave = function (req, res) {
    req.trip.leave(req.user._id, function (err) {
        if (err) {
            res.jsonp(500, err);
        }
        else {
            res.end();
        }
    });
};

exports.trip = function (req, res, next, tripId) {
    Trip.load(tripId, function (err, trip) {
        if (err) {
            return next(err);
        }
        if (!trip) {
            return next(new Error('Cannot load trip by id ' + tripId));
        }
        req.trip = trip;
        next();
    });
};

exports.getPassengers = function(req, res) {
    Trip.getPassengers(req.trip._id, function(err, trip) {
        if (err || !trip) {
            res.jsonp(500,err);
        }
        res.jsonp(trip.passengers);
    });
};