'use strict';
var async = require('async'),
    entity = require('../entity-helper'),
    mongoose = require('mongoose'),
    Location = mongoose.model('Location');

describe.only('Location model', function () {
    var user,
        locationA,
        locationB;

    before(function (done) {
        async.parallel([
            function createUser(done) {
                user = entity.user();
                user.save(done);
            },
            function removeLocations(done) {
                Location.remove({}, done);
            }
        ], done);
    });

    beforeEach(function (done) {
        locationA = entity.location({ creator: user._id });
        locationB = entity.location({ creator: user._id });
        done();
    });

    describe('Create', function () {
        it('should create new locations without error', function (done) {
            locationA.save(done);
        });

//        it('should fail if required properties missed', function (done) {
//
//        });
    });
});