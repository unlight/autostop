'use strict';

var supertest = require('supertest'),
    server = supertest(require('../../../server')),
    should = require('should'),
    _ = require('underscore'),
    async = require('async'),
    service = require('../service-helper')(server);

describe('Trip service', function () {
    var routeA;
    var userBId;

    before(function (done) {
        async.parallel([
            function createRouteA(done) {
                async.waterfall([
                    function createUser(done) {
                        service.user.create(done);
                    },
                    function createRoute(userId, done) {
                        service.route.create(userId, done);
                    }
                ], done);
            },
            function createUserB(done) {
                service.user.create(done);
            }
        ], function (err, results) {
            routeA = results[0];
            userBId = results[1];
            done(err);
        });
    });

    describe('POST /trips', function () {
        it('should create new trip without error', function (done) {
            service.trip.create(routeA.creator, { route: routeA._id },
                function (err, trip) {
                    trip.route._id.should.equal(routeA._id);
                    trip.creator._id.should.equal(routeA.creator);
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
                .set('userId', userBId)
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
                    trip.route._id.should.equal(routeA._id);
                    trip.creator._id.should.equal(routeA.creator);
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
                        .set('userId', userBId)
                        .send(updateData)
                        .expect(401)
                        .end(done);
                }], done);
        });
    });

    describe('DELETE /trips/:tripId', function () {
        it('should deactivate trip without error', function (done) {
            async.waterfall([
                function createTrip(done) {
                    service.trip.create(routeA.creator, { route: routeA._id },
                        function (err, trip) {
                            done(err, trip._id);
                        });
                },
                function deactivateTrip(tripId, done) {
                    server.del('/api/trips/' + tripId)
                        .set('userId', routeA.creator)
                        .expect(200)
                        .end(function (err, res) {
                            done(err, tripId);
                        });
                },
                function loadTrip(tripId, done) {
                    server.get('/api/trips/' + tripId)
                        .expect(200)
                        .end(function (err, res) {
                            done(err, res.body);
                        });
                }],
                function (err, trip) {
                    done(err);
                    trip.active.should.be.false;
                });
        });

        it('should fail for not authenticated request', function (done) {
            async.waterfall([
                function createTrip(done) {
                    service.trip.create(routeA.creator, { route: routeA._id },
                        function (err, trip) {
                            done(err, trip._id);
                        });
                },
                function deactivateTrip(tripId, done) {
                    server.del('/api/trips/' + tripId)
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
                function deactivateTrip(tripId, done) {
                    server.del('/api/trips/' + tripId)
                        .set('userId', userBId)
                        .expect(401)
                        .end(done);
                }], done);
        });
    });

    describe('POST /trips/:tripId/join', function () {
        it('should add current user to the list of passengers', function (done) {
            async.waterfall([
                function createTrip(done) {
                    service.trip.create(routeA.creator, { route: routeA._id },
                        function (err, trip) {
                            done(err, trip._id);
                        });
                },
                function joinTrip(tripId, done) {
                    server.post('/api/trips/' + tripId + '/join')
                        .set('userId', userBId)
                        .expect(200)
                        .end(function (err, res) {
                            done(err, tripId);
                        });
                },
                function loadTrip(tripId, done) {
                    server.get('/api/trips/' + tripId)
                        .expect(200)
                        .end(function (err, res) {
                            done(err, res.body);
                        });
                }],
                function (err, trip) {
                    done(err);
                    trip.passengers.length.should.equal(1);
                    trip.passengers[0].should.equal(userBId);
                });
        });

        it('should fail for not authenticated request', function (done) {
            async.waterfall([
                function createTrip(done) {
                    service.trip.create(routeA.creator, { route: routeA._id },
                        function (err, trip) {
                            done(err, trip._id);
                        });
                },
                function joinTrip(tripId, done) {
                    server.post('/api/trips/' + tripId + '/join')
                        .expect(401)
                        .end(done);
                }], done);
        });
    });

    describe('POST /trips/:tripId/leave', function () {
        it('should remove current user from the list of passengers', function (done) {
            async.waterfall([
                function createTrip(done) {
                    service.trip.create(routeA.creator, { route: routeA._id },
                        function (err, trip) {
                            done(err, trip._id);
                        });
                },
                function joinTrip(tripId, done) {
                    server.post('/api/trips/' + tripId + '/join')
                        .set('userId', userBId)
                        .expect(200)
                        .end(function (err, res) {
                            done(err, tripId);
                        });
                },
                function leaveTrip(tripId) {
                    server.post('/api/trips/' + tripId + '/leave')
                        .set('userId', userBId)
                        .expect(200)
                        .end(function (err, res) {
                            done(err, tripId);
                        });
                },
                function loadTrip(tripId, done) {
                    server.get('/api/trips/' + tripId)
                        .expect(200)
                        .end(function (err, res) {
                            done(err, res.body);
                        });
                }],
                function (err, trip) {
                    done(err);
                    trip.passengers.length.should.equal(0);
                });
        });

        it('should fail for not authenticated request', function (done) {
            async.waterfall([
                function createTrip(done) {
                    service.trip.create(routeA.creator, { route: routeA._id },
                        function (err, trip) {
                            done(err, trip._id);
                        });
                },
                function joinTrip(tripId, done) {
                    server.post('/api/trips/' + tripId + '/join')
                        .set('userId', userBId)
                        .expect(200)
                        .end(function (err) {
                            done(err, tripId);
                        });
                },
                function leaveTrip(tripId, done) {
                    server.post('/api/trips/' + tripId + '/join')
                        .expect(401)
                        .end(done);
                }], done);
        });
    });
});