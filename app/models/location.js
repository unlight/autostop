'use strict';

var _ = require('underscore'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = mongoose.Types.ObjectId;

var LocationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    created: {
        type: Date,
        required: true
    }
});

LocationSchema.pre('validate', function (next) {
    var location = this;
    location.created = location.created || new Date();
    next();
});

LocationSchema.statics.load = function (locationId, done) {
    this.findById(locationId)
        .populate('creator')
        .exec(done);
};

LocationSchema.statics.search = function (searchData, done) {
    var searchCriteria = _.pick(searchData, 'title', 'creator');
    if (searchCriteria.title) {
        searchCriteria.title = new RegExp(searchCriteria.title, 'i');
    }
    if (searchCriteria.creator) {
        searchCriteria.creator = searchCriteria.creator instanceof ObjectId ?
            searchCriteria.creator :
            new ObjectId(searchCriteria.creator);
    }

    var sortCriteria = {};
    sortCriteria[searchData.sortBy || 'title'] = searchData.sortDirection || 'asc';

    this.find(searchCriteria)
        .sort(sortCriteria)
        .populate('creator')
        .exec(done);
};

mongoose.model('Location', LocationSchema);