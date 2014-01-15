var _ = require('underscore'),
    uuid = require('node-uuid'),
    mongoose = require('mongoose');


exports.user = function (source) {
    return _.extend(user(), source);
};

exports.route = function (source) {
    return _.extend(route(), source);
};

exports.trip = function (source) {
    return _.extend(trip(), source);
};

exports.location = function (source) {
    return _.extend(location(), source);
};

function user() {
    var User = mongoose.model('User');

    return new User({
        name: 'User name',
        email: 'User email',
        username: uuid.v1(),
        password: 'User password'
    });
}

function route() {
    var Route = mongoose.model('Route');

    return new Route({
        title: 'Route title',
        creator: user()
    });
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

function location() {
    var Location = mongoose.model('Location');

    return new Location({
        title: 'Location Title',
        point: {
            type: 'Point',
            coordinates: [ 10, 10 ]
        }
    });
}