'use strict';

var _ = require('underscore'),
    uuid = require('node-uuid'),
    mongoose = require('mongoose');

function user() {
    var User = mongoose.model('User');

    return new User({
        name: 'User name',
        email: 'User email',
        username: uuid.v1(),
        password: 'User password',
        phone: 'phone'
    });
}

function route() {
    var Route = mongoose.model('Route'),
        creator = user(),
        origin = location({creator: creator}),
        destination = location({creator: creator});

    return new Route({
        title: 'Route title',
        origin: origin,
        destination: destination,
        creator: creator
    });
}

function location(source) {
    var Location = mongoose.model('Location');

    return _.extend(new Location({
        title: 'Location',
        creator: user._id
    }), source);
}

function trip() {
    var Trip = mongoose.model('Trip'),
        creator = user();

    return new Trip({
        route: route({ creator: creator}),
        start: new Date(),
        note: 'Trip note',
        creator: creator
    });
}

exports.user = function (source) {
    return _.extend(user(), source);
};

exports.location = function (source) {
    return _.extend(location(), source);
};

exports.route = function (source) {
    source = source || {};
    return _.extend(route({creator: source.creator}), source);
};

exports.trip = function (source) {
    return _.extend(trip(), source);
};