'use strict';
/*jshint expr:true*/

var should = require('should'),
    async = require('async'),
    _ = require('underscore'),
    uuid = require('node-uuid'),
    entity = require('../entity-helper'),
    mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId,
    User = mongoose.model('User'),
    Location = mongoose.model('Location');

describe('Location model', function () {
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

    describe('Search', function () {
        it('should return all locations by default', function (done) {
            async.series({
                createLocation: function (done) {
                    locationA.save(done);
                },
                findLocations: function (done) {
                    Location.search({}, done);
                }
            }, function (err, results) {
                done(err);
                var locations = results.findLocations;
                locations.length.should.be.above(0);
                _.each(locations, function (location) {
                    location.creator.should.be.an.instanceof(User);
                });
            });
        });

        it('should be able to find locations by substring in title', function (done) {
            var token = uuid.v1();

            async.series({
                createLocations: function (done) {
                    locationA.title = 'Head' + token + 'Tail';
                    locationA.save(done);
                },
                findLocations: function (done) {
                    Location.search({ title: token }, done);
                }
            }, function (err, results) {
                done(err);
                var locations = results.findLocations;
                locations.length.should.equal(1);
                locations[0].id.should.equal(locationA.id);
            });
        });

        it('should be able to find locations by creator', function (done) {
            var userB;

            async.series({
                createLocations: function (done) {
                    async.parallel([
                        function createLocationA(done) {
                            locationA.save(done);
                        },
                        function createLocationB(done) {
                            async.series({
                                createUser: function (done) {
                                    userB = entity.user();
                                    userB.save(done);
                                },
                                createLocation: function (done) {
                                    locationB.creator = userB._id;
                                    locationB.save(done);
                                }
                            }, done);
                        }
                    ], done);
                },
                findLocations: function (done) {
                    Location.search({ creator: userB.id }, done);
                }
            }, function (err, results) {
                done(err);
                var locations = results.findLocations;
                locations.length.should.equal(1);
                locations[0].creator.id.should.equal(userB.id);
            });
        });

        it('should sort locations by title asc by default', function (done) {
            async.series({
                createLocations: function (done) {
                    async.parallel([
                        function createLocationA(done) {
                            locationA.title = 'Location A';
                            locationA.save(done);
                        },
                        function createLocationB(done) {
                            locationB.title = 'Location B';
                            locationB.save(done);
                        }
                    ], done);
                },
                findLocations: function (done) {
                    Location.search({}, done);
                }
            }, function (err, results) {
                done(err);
                var locations = results.findLocations;
                locations.length.should.be.above(1);
                for (var i = 0; i < locations.length - 1; i++) {
                    (locations[i].title <= (locations[i + 1].title)).should.be.ok;
                }
            });
        });

        it('should be able to sort locations by title', function (done) {
            async.series({
                createLocations: function (done) {
                    async.parallel([
                        function createLocationA(done) {
                            locationA.title = 'Location A';
                            locationA.save(done);
                        },
                        function createLocationB(done) {
                            locationB.title = 'Location B';
                            locationB.save(done);
                        }
                    ], done);
                },
                findLocations: function (done) {
                    async.parallel([
                        function asc(done) {
                            Location.search({ sortBy: 'title', sortDirection: 'asc'}, done);
                        },
                        function desc(done) {
                            Location.search({ sortBy: 'title', sortDirection: 'desc'}, done);
                        }
                    ], done);
                }
            }, function (err, results) {
                done(err);
                var locationsAsc = results.findLocations[0],
                    locationsDesc = results.findLocations[1];

                locationsAsc.length.should.be.above(1);
                for (var i = 0; i < locationsAsc.length - 1; i++) {
                    (locationsAsc[i].title <= (locationsAsc[i + 1].title)).should.be.ok;
                }

                locationsDesc.length.should.be.above(1);
                for (i = 0; i < locationsDesc.length - 1; i++) {
                    (locationsDesc[i].title >= (locationsDesc[i + 1].title)).should.be.ok;
                }
            });
        });
    });
});