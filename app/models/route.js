'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    _ = require('underscore'),
    Schema = mongoose.Schema,
    ObjectId = mongoose.Types.ObjectId;


/**
 * Route Schema
 */
var RouteSchema = new Schema({
    title: {
        type: String,
        default: '',
        trim: true,
        required: true
    },
    origin: {
        type: String,
        default: '',
        trim: true,
        required: true
    },
    destination: {
        type: String,
        default: '',
        trim: true,
        required: true
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
    icon: {
        type: String
    },
    seats: {
        type: Number
    },
    start: {
        type: Date
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
    created: {
        type: Date,
        required: true
    }
});

RouteSchema.virtual('creatorId')
    .get(function () {
        return this.creator._id || this.creator;
    });

RouteSchema.methods.update = function (updateData, callback) {
    var route = this;
    updateData = _.pick(updateData, 'title', 'origin', 'destination', 'description', 'seats', 'icon', 'start');
    _.extend(route, updateData);
    route.save(callback);
};

RouteSchema.methods.deactivate = function (callback) {
    this.model('Route')
        .update(
        { _id: this._id },
        { $set: { active: false } }, callback);
};


RouteSchema.statics.load = function (id, cb) {
    this.findById(id)
        .populate('creator')
        .exec(cb);
};

RouteSchema.statics.search = function (searchData, callback) {
    searchData = searchData || {};

    var searchCriteria = {},
        defaults = {
            active: true
        };

    if (!searchData.includeInactive) {
        searchCriteria.active = defaults.active;
    }

    if (searchData.creator) {
        searchCriteria.creator = {};
        searchCriteria.creator._id = searchData.creator instanceof ObjectId ?
            searchData.creator :
            new ObjectId(searchData.creator);
    }

    var sortCriteria = {};
    sortCriteria[searchData.sortBy || 'created'] = searchData.sortDirection || 'descending';

    this.find(searchCriteria)
        .sort(sortCriteria)
        .populate('creator')
        .exec(callback);
};

RouteSchema.pre('validate', function (next) {
    this.created = this.created || new Date();
    next();
});

mongoose.model('Route', RouteSchema);