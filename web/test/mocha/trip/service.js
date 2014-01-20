'use strict';

var supertest = require('supertest'),
    server = supertest(require('../../../server')),
    should = require('should'),
    _ = require('underscore'),
    async = require('async'),
    service = require('../service-helper')(server);

describe.only('Trip service', function () {
    var routeA;
    var routeB;

    before(function (done) {
        async.parallel([
            function createRouteA(done) {
                createRoute(done);
            },
            function createRouteB(done) {
                createRoute(done);
            }
        ], function (err, routes) {
            routeA = routes[0];
            routeB = routes[1];
            done(err);
        });

        function createRoute(done) {
            async.waterfall([
                function createUser(done) {
                    service.user.create(done);
                },
                function createRouteA(userId, done) {
                    service.route.create(userId, done);
                }
            ], done);
        }
    });

    describe('POST /trips', function () {
        it('should create new trip without error', function (done) {
            service.trip.create(routeA.creator, { route: routeA._id },
                function (err, trip) {
                    trip.creator.should.equal(routeA.creator);
                    done(err);
                });
        });

        it('should fail for not authenticated user', function (done) {
            var createData = service.trip.getCreateData({ route: routeA._id});

            server.post('/api/routes')
                .send(createData)
                .expect(401)
                .end(done);
        });

        it('should fail if current user do not match with route\'s creator', function (done) {
            var createData = service.trip.getCreateData({ route: routeA._id});

            server.post('/api/trips')
                .set('userId', routeB.creator)
                .send(createData)
                .expect(401)
                .end(done);
        });
    });

    describe('GET /trips/:tripId', function () {
        it('should retrieve trip without error', function (done) {
            async.waterfall([
                function createTrip(done) {
                    service.trip.create(routeA.creator, { route: routeA._id }, done);
                },
                function loadTrip(trip, done) {
                    server.get('/api/trips/' + trip._id)
                        .end(function (err, res) {
                            done(err, trip._id, res.body);
                        });
                }
            ], function (err, tripId, trip) {
                trip._id.should.equal(tripId);
                done(err);
            });
        });
    });

    describe('GET /trips', function () {
        it('should retrieve all trips', function (done) {
            async.waterfall([
                function createTrip(done) {
                    service.trip.create(routeA.creator, { route: routeA._id },
                        function (err, trip) {
                            done(err, trip._id);
                        });
                },
                function loadTrips(tripId, done) {
                    server.get('/api/trips')
                        .end(function (err, res) {
                            done(err, tripId, res.body);
                        });
                }
            ], function (err, tripId, trips) {
                var trip = _.find(trips, function (trip) {
                    return trip._id == tripId;
                });
                trip.should.be.ok;

                done(err);
            });
        });
    });

    describe('PUT /trips/:tripId', function () {
        it('should update trip without error', function (done) {
            async.waterfall([
                function createTrip(done) {
                    service.trip.create(routeA.creator, { route: routeA._id },
                        function (err, trip) {
                            done(err, trip._id);
                        });
                },
                function updateTrip(tripId, done) {
                    var updateData = service.trip.getUpdateData();

                    server.put('/api/trips/' + tripId)
                        .set('userId', routeA.creator)
                        .send(updateData)
                        .expect(200)
                        .end(function (err, res) {
                            done(err, updateData, res.body);
                        });
                }],
                function (err, updateData, trip) {
                    new Date(trip.start).should.eql(updateData.start);
                    done(err);
                });
        });

        it('should fail if user is not authenticated', function (done) {
            async.waterfall([
                function createTrip(done) {
                    service.trip.create(routeA.creator, { route: routeA._id },
                        function (err, trip) {
                            done(err, trip._id);
                        });
                },
                function updateTrip(tripId, done) {
                    var updateData = service.trip.getUpdateData();

                    server.put('/api/trips/' + tripId)
                        .send(updateData)
                        .expect(401)
                        .end(done);
                }], done);
        });

        it('should fail if current user do not match trip\'s creator', function (done) {
            async.waterfall([
                function createTrip(done) {
                    service.trip.create(routeA.creator, { route: routeA._id },
                        function (err, trip) {
                            done(err, trip._id);
                        });
                },
                function updateTrip(tripId, done) {
                    var updateData = service.trip.getUpdateData();

                    server.put('/api/trips/' + tripId)
                        .set('userId', routeB.creator)
                        .send(updateData)
                        .expect(401)
                        .end(done);
                }], done);
        });
    });
});