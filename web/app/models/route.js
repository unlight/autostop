'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
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
        trim: true
    },
    destination: {
        type: String,
        default: '',
        trim: true
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    active: {
        type: Boolean,
        default: true
    }
});

RouteSchema.virtual('creatorId')
    .get(function () {
        return this.creator._id || this.creator;
    });

RouteSchema.methods.deactivate = function (callback) {
    this.model('Route')
        .update(
        { _id: this._id },
        { $set: { active: false } }, callback);
};

/**
 * Statics
 */
RouteSchema.statics.load = function (id, cb) {
    this.findOne({  _id: id })
        .populate('creator')
        .exec(cb);
};

RouteSchema.statics.search = function (searchData, callback) {
    searchData = searchData || {};

    var criteria = {},
        defaults = {
            active: true
        };

    if (!searchData.includeInactive) {
        criteria.active = defaults.active;
    }

    if (searchData.creator) {
        criteria.creator = {};
        criteria.creator._id = searchData.creator instanceof ObjectId ?
            searchData.creator :
            new ObjectId(searchData.creator);
    }

    this.find(criteria)
        .populate('creator')
        .exec(callback);
};

mongoose.model('Route', RouteSchema);