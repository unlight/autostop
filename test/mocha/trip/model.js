'use strict';

/*jshint expr: true*/
require('../../../server');

var should = require('should'),
    async = require('async'),
    mongoose = require('mongoose'),
    _ = require('underscore'),
    entity = require('../entity-helper'),
    Route = mongoose.model('Route'),
    Trip = mongoose.model('Trip'),
    User = mongoose.model('User');

var user;
var route;
var trip;

describe.only('Model Trip', function () {

    before(function (done) {
        user = entity.user();
        route = entity.route({ creator: user });

        async.series({
            saveUser: function (callback) {
                user.save(callback);
            },
            saveRoute: function (callback) {
                route.save(callback);
            }
        }, done);
    });

    beforeEach(function (done) {
        trip = entity.trip({ route: route, creator: user });
        done();
    });

    describe('Method save', function () {
        it('should be able to save without problems', function (done) {
            trip.save(function (err) {
                trip.active.should.be.true;
                done(err);
            });
        });

        it('should fail if no start date is specified', function (done) {
            trip.start = null;
            trip.save(function (err) {
                should.exist(err);
                done();
            });
        });

        it('should fail if no creator specified', function (done) {
            trip.creator = null;
            trip.save(function (err) {
                should.exist(err);
                done();
            });
        });

        it('should fail if trip\'s creator do not match route\'s creator', function (done) {
            var userB = entity.user();
            var routeB = entity.route({ creator: userB });
            trip.route = routeB;

            async.series({
                saveUserB: function (callback) {
                    userB.save(callback);
                },
                saveRouteB: function (callback) {
                    route.save(callback);
                },
                saveTrip: function () {
                    trip.save(function (err) {
                        should.exist(err);
                        done();
                    });
                }
            });
        });
    });

    describe('Method load', function () {
        it('should be able to load trip by id', function (done) {
            async.series({
                saveTrip: function (callback) {
                    trip.save(callback);
                },
                loadTrip: function (callback) {
                    Trip.load(trip._id, callback);
                }
            }, function (err, results) {
                var trip = results.loadTrip;
                trip.should.be.an.instanceof(Trip);
                done(err);
            });
        });

        it('should be able to populate referenced properties', function (done) {
            async.series({
                saveTrip: function (callback) {
                    trip.save(callback);
                },
                loadTrip: function (callback) {
                    Trip.load(trip._id, callback);
                }
            }, function (err, results) {
                var trip = results.loadTrip;
                trip.creator.should.be.an.instanceof(User);
                trip.route.should.be.an.instanceof(Route);
                done(err);
            });
        });
    });

    describe('Method deactivate', function () {
        it('should be able to deactivate without problems', function (done) {
            async.series({
                saveTrip: function (callback) {
                    trip.save(callback);
                },
                deactivateTrip: function (callback) {
                    trip.active.should.be.true;
                    trip.deactivate(callback);
                },
                loadTrip: function (callback) {
                    Trip.load(trip._id, callback);
                }
            }, function (err, results) {
                var trip = results.loadTrip;
                trip.active.should.be.false;
                done(err);
            });
        });
    });

    describe('Method join', function () {
        it('should be able to join passenger to the trip', function (done) {
            var userB = entity.user();

            async.series({
                saveUserB: function (callback) {
                    userB.save(callback);
                },
                joinTrip: function (callback) {
                    trip.join(userB._id, callback);
                },
                loadTrip: function (callback) {
                    Trip.load(trip._id, callback);
                }
            }, function (err, results) {
                var trip = results.loadTrip;
                trip.passengers.length.should.equal(1);
                done(err);
            });
        });

        it('should not allow join the passenger twice', function (done) {
            var userB = entity.user();

            async.series({
                saveUserB: function (callback) {
                    userB.save(callback);
                },
                joinTripFirstTime: function (callback) {
                    trip.join(userB._id, callback);
                },
                joinTripSecondTime: function (callback) {
                    trip.join(userB._id, callback);
                },
                loadTrip: function (callback) {
                    Trip.load(trip._id, callback);
                }
            }, function (err, results) {
                var trip = results.loadTrip;
                trip.passengers.length.should.equal(1);
                done(err);
            });
        });

        it('should fail if user try to join to his own trip', function (done) {
            trip.join(user._id, function (err) {
                should.exist(err);
                done();
            });
        });
    });

    describe('Method leave', function () {
        it('should allow user leaving the trip', function (done) {
            var userB = entity.user();

            async.series({
                saveUserB: function (callback) {
                    userB.save(callback);
                },
                joinTrip: function (callback) {
                    trip.join(userB._id, callback);
                },
                leaveTrip: function (callback) {
                    trip.leave(userB._id, callback);
                },
                loadTrip: function (callback) {
                    Trip.load(trip._id, callback);
                }
            }, function (err, results) {
                var trip = results.loadTrip;
                trip.passengers.length.should.equal(0);
                done(err);
            });
        });
    });

    describe('Method search', function () {
        var tripA;
        var tripB;

        beforeEach(function (done) {
            tripA = entity.trip({ creator: user, route: route });
            tripB = entity.trip({ creator: user, route: route });

            Trip.remove().exec(function (err) {
                done(err);
            });
        });

        it('should be able to find all trips if no parameters specified', function (done) {
            async.series({
                saveTrips: function (callback) {
                    async.parallel({
                        saveTripA: function (callback) {
                            tripA.save(callback);
                        },
                        saveTripB: function (callback) {
                            tripB.save(callback);
                        }
                    }, callback);
                },
                findTrips: function (callback) {
                    Trip.search({}, callback);
                }
            }, function (err, results) {
                var trips = results.findTrips;
                trips.length.should.equal(2);
                done(err);
            });
        });

        it('should populate all referenced properties', function (done) {
            async.series({
                saveTrips: function (callback) {
                    async.parallel({
                        saveTripA: function (callback) {
                            tripA.save(callback);
                        },
                        saveTripB: function (callback) {
                            tripB.save(callback);
                        }
                    }, callback);
                },
                findTrips: function (callback) {
                    Trip.search({}, callback);
                }
            }, function (err, results) {
                var trips = results.findTrips;
                trips.length.should.equal(2);
                _.each(trips, function (trip) {
                    trip.creator.should.be.an.instanceof(User);
                    trip.route.should.be.an.instanceof(Route);
                });
                done(err);
            });
        });

        it('should return only active trips by default', function (done) {
            async.series({
                saveTrip: function (callback) {
                    tripA.save(callback);
                },
                deactivateTrip: function (callback) {
                    tripA.deactivate(callback);
                },
                findTrips: function (callback) {
                    Trip.search({}, callback);
                }
            }, function (err, results) {
                var trips = results.findTrips;
                trips.length.should.equal(0);
                done(err);
            });
        });

        it('should be able to include inactive trips', function (done) {
            async.series({
                saveTrip: function (callback) {
                    tripA.save(callback);
                },
                deactivateTrip: function (callback) {
                    tripA.deactivate(callback);
                },
                findTrips: function (callback) {
                    Trip.search({ includeInactive: true }, callback);
                }
            }, function (err, results) {
                var trips = results.findTrips;
                trips.length.should.equal(1);
                done(err);
            });
        });

        it('should be able to filter by min start date', function (done) {
            var start = new Date(2013, 1, 1),
                future = new Date(2014, 1, 1);
            tripA.start = start;


            async.series({
                saveTrip: function (callback) {
                    tripA.save(callback);
                },
                findTrips: function (callback) {
                    Trip.search({ startMin: future }, callback);
                }
            }, function (err, results) {
                var trips = results.findTrips;
                trips.length.should.equal(0);
                done(err);
            });
        });

        it('should be able to filter by creator', function (done) {
            async.series({
                saveTrips: function (callback) {
                    async.parallel({
                        saveTripA: function (callback) {
                            tripA.save(callback);
                        },
                        saveTripB: function (callback) {
                            var userB = entity.user();
                            var routeB = entity.route({ creator: userB });
                            tripB.creator = userB;
                            tripB.route = routeB;

                            async.series({
                                saveUserB: function (callback) {
                                    userB.save(callback);
                                },
                                saveRouteB: function (callback) {
                                    routeB.save(callback);
                                },
                                saveTripB: function (callback) {
                                    tripB.save(callback);
                                }
                            }, callback);
                        }
                    }, callback);
                },
                findTrips: function (callback) {
                    Trip.search({ creator: tripB.creator }, callback);
                }
            }, function (err, results) {
                var trips = results.findTrips;
                trips.length.should.equal(1);
                done(err);
            });
        });

        it('should sort trips by start date asc by default', function (done) {
            async.series({
                createTrips: function (done) {
                    async.parallel([
                        function createTripA(done) {
                            trip.start = new Date();
                            trip.save(done);
                        },
                        function createTripB(done) {
                            var now = new Date();
                            var tripB = entity.trip({
                                creator: user._id,
                                route: route._id,
                                start: now.setFullYear(now.getFullYear() + 1)
                            });
                            tripB.save(done);
                        }
                    ], done);
                },
                findTrips: function (done) {
                    Trip.search({}, done);
                }
            }, function (err, results) {
                done(err);
                var trips = results.findTrips;
                trips.length.should.be.above(1);
                for (var i = 0; i < trips.length - 1; i++) {
                    (trips[i].start <= trips[i + 1].start).should.be.ok;
                }
            });
        });

        it('should be able to sort trips by start date', function (done) {
            async.series({
                createTrips: function (done) {
                    async.parallel([
                        function createTripA(done) {
                            trip.start = new Date();
                            trip.save(done);
                        },
                        function createTripB(done) {
                            var now = new Date();
                            var tripB = entity.trip({
                                creator: user._id,
                                route: route._id,
                                start: now.setFullYear(now.getFullYear() + 1)
                            });
                            tripB.save(done);
                        }
                    ], done);
                },
                findTrips: function (done) {
                    async.parallel([
                        function searchAsc(done) {
                            Trip.search({
                                sortDirection: 'asc',
                                sortBy: 'start'
                            }, done);
                        },
                        function searchDesc(done) {
                            Trip.search({
                                sortDirection: 'desc',
                                sortBy: 'start'
                            }, done);
                        }
                    ], done);
                }
            }, function (err, results) {
                done(err);

                var tripsAsc = results.findTrips[0];
                tripsAsc.length.should.be.above(1);
                for (var i = 0; i < tripsAsc.length - 1; i++) {
                    (tripsAsc[i].start <= tripsAsc[i + 1].start).should.be.ok;
                }

                var tripsDesc = results.findTrips[1];
                tripsDesc.length.should.be.above(1);
                for (i = 0; i < tripsDesc.length - 1; i++) {
                    (tripsDesc[i].start >= tripsDesc[i + 1].start).should.be.ok;
                }
            });
        });
    });

    afterEach(function (done) {
        Route.remove({});
        done();
    });
});