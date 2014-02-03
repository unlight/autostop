'use strict';
/*jshint expr:true*/

var should = require('should'),
    async = require('async'),
    entity = require('../entity-helper'),
    mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId,
    User = mongoose.model('User'),
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
            locationA.save(function (err) {
                done(err);
                locationA._id.should.be.an.instanceof(ObjectId);
                locationA.created.should.exist;
            });
        });

        it('should fail if title is missed', function (done) {
            locationA.title = null;
            locationA.save(function (err) {
                done();
                should.exist(err);
            });
        });

        it('should fail if creator is missed', function (done) {
            locationA.creator = null;
            locationA.save(function (err) {
                done();
                should.exist(err);
            });
        });
    });

    describe('Load', function () {
        it('should load location by id', function (done) {
            async.series({
                createLocation: function (done) {
                    locationA.save(done);
                },
                loadLocation: function (done) {
                    Location.load(locationA._id, done);
                }
            }, function (err, results) {
                done(err);
                var location = results.loadLocation;
                location.id.should.equal(locationA.id);
                location.creator.should.be.an.instanceof(User);
            });
        });
    });
});