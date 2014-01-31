'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

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

//LocationSchema.statics.search = function (searchData, done) {
//};

mongoose.model('Location', LocationSchema);