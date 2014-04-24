'use strict';

require('./user');

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = mongoose.Types.ObjectId,
    Route = mongoose.model('Route');

var TripSchema = new Schema({
    route: {
        type: Schema.Types.ObjectId,
        ref: 'Route',
        required: true
    },
    start: {
        type: Date,
        required: true
    },
    note: {
        type: String,
        default: '',
        trim: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    passengers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    active: {
        type: Boolean,
        default: true
    }
});

TripSchema.virtual('creatorId')
    .get(function () {
        if (!this.creator) {
            return undefined;
        }

        return this.creator._id || this.creator;
    });

TripSchema.path('route').validate(function (route, done) {
    var trip = this;
    var routeId = route instanceof mongoose.Model ?
        route._id :
        route;

    Route.load(routeId, function (err, route) {
        var valid = !err &&
            route && trip.creator &&
            route.creatorId.equals(trip.creatorId);

        done(valid);
    });
}, 'Route is either not exist or do not match this trip.');

TripSchema.path('passengers').validate(function (passengers) {
    var trip = this;
    return passengers.indexOf(trip.creatorId) < 0;
}, 'User cannot join his own trip.');

TripSchema.methods.deactivate = function (callback) {
    this.model('Trip').update(
        { _id: this._id },
        { $set: { active: false } },
        callback);
};

TripSchema.methods.join = function (passengerId, callback) {
    var trip = this;
    trip.passengers.addToSet(passengerId);
    trip.save(callback);
};

TripSchema.methods.leave = function (passengerId, callback) {
    var trip = this;
    trip.passengers.pull(passengerId);
    trip.save(callback);
};

TripSchema.statics.load = function (tripId, callback) {
    this.findById(tripId)
        .populate('creator route')
        .exec(callback);
};

TripSchema.statics.search = function (searchData, callback) {
    var searchCriteria = {};
    var creatorOptions = {
        path: 'creator',
        select: '-hashed_password -salt'
    };
    var routeOptions = {
        path: 'route'
    };

    if (!searchData.includeInactive) {
        searchCriteria.active = true;
    }

    if (searchData.startMin) {
        searchCriteria.start = {
            '$gte': new Date(searchData.startMin)
        };
    }

    if (searchData.startMax) {
        searchCriteria.start = {
            '$lte': new Date(searchData.startMax)
        };
    }

    if (searchData.passenger) {
        var passenger = searchData.passenger;
        // if (!(passenger instanceof ObjectId)) {
        //     passenger = new ObjectId(passenger);
        // }
        searchCriteria.passengers = passenger;
    }

    if (searchData.creator) {
        searchCriteria.creator = searchData.creator instanceof ObjectId ?
            searchData.creator :
            new ObjectId(searchData.creator);
    }


    if (searchData.originLocation) {
        var originLocation = searchData.originLocation;
        routeOptions.match = routeOptions.match || {};
        routeOptions.match = {origin: originLocation};
    }

    if (searchData.destinationLocation) {
        var destinationLocation = searchData.destinationLocation;
        routeOptions.match = routeOptions.match || {};
        routeOptions.match = {origin: destinationLocation};
    }

    var sortCriteria = {};
    sortCriteria[searchData.sortBy || 'start'] = searchData.sortDirection || 'ascending';

    this.find(searchCriteria)
        .sort(sortCriteria)
        .populate([creatorOptions, routeOptions])
        .exec(callback);
};

mongoose.model('Trip', TripSchema);