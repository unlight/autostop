'use strict';

var mongoose = require('mongoose'),
    Trip = mongoose.model('Trip'),
    _ = require('underscore');

exports.search = function (req, res) {
    Trip.search(req.query, function (err, trips) {
        if (err) {
            res.render('error', { status: 500 });
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
            res.status(401);
            res.jsonp(err);
        }
        else {
            Trip.load(trip._id, function (err, trip) {
                if (err) {
                    res.status(500);
                    res.jsonp(err);
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
            res.render('error', { status: 500 });
        }
        else {
            res.jsonp(trip);
        }
    });
};

exports.join = function (req, res) {
    req.trip.join(req.user._id, function (err) {
        if (err) {
            return res.render('err', { status: 500 });
        }
        res.end();
    });
};

exports.leave = function (req, res) {
    req.trip.leave(req.user._id, function (err) {
        if (err) {
            res.render('err', { status: 500 });
        }
        res.end();
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