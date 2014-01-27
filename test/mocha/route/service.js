'use strict';
/*jshint expr: true*/

require('should');

var supertest = require('supertest'),
    server = supertest(require('../../../server')),
    async = require('async'),
    service = require('../service-helper')(server);

describe('Route service', function () {
    var userAId;
    var userBId;

    before(function (done) {
        async.parallel([
            function createUserA(done) {
                service.user.create(done);
            },
            function createUserB(done) {
                service.user.create(done);
            }
        ], function (err, results) {
            userAId = results[0]._id;
            userBId = results[1]._id;
            done(err);
        });
    });

    describe('POST /routes', function () {
        it('should create a new route without error', function (done) {
            service.route.create(userAId, function (err, route) {
                route.creator._id.should.equal(userAId);
                done(err);
            });
        });

        it('should create a new route with optional fields', function (done) {
            var createData = service.route.getCreateData();
            createData.icon = 'Icon';
            createData.seats = 5;
            createData.start = new Date(1, 1, 1, 18, 55);

            server.post('/api/routes')
                .set('userId', userAId)
                .send(createData)
                .expect(200)
                .end(function (err, res) {
                    done(err);

                    var route = res.body;
                    route.icon.should.equal(createData.icon);
                    route.seats.should.equal(createData.seats);
                    new Date(route.start).should.eql(createData.start);
                });
        });

        it('should fail to create a route for not authenticated user', function (done) {
            var createData = service.route.getCreateData();

            server.post('/api/routes')
                .send(createData)
                .expect(401)
                .end(done);
        });
    });

    describe('GET /routes', function () {
        it('should sort routes by creation date descending by default', function (done) {
            async.series({
                createRoutes: function (done) {
                    async.parallel([
                        function createRouteA(done) {
                            service.route.create(userAId, done);
                        },
                        function createRouteB(done) {
                            setTimeout(function () {
                                service.route.create(userAId, done);
                            }, 1000);
                        }
                    ], done);
                },
                findRoutes: function (done) {
                    server.get('/api/routes')
                        .expect(200)
                        .end(function (err, res) {
                            done(err, res.body);
                        });
                }
            }, function (err, results) {
                done(err);
                var routes = results.findRoutes;
                routes.length.should.be.above(1);
                for (var i = 0; i < routes.length - 1; i++) {
                    var first = new Date(routes[i].created),
                        next = new Date(routes[i + 1].created);
                    first.should.be.above(next);
                }
            });
        });

        it('should be able to sort routes by creation date ascending', function (done) {
            async.series({
                createRoutes: function (done) {
                    async.parallel([
                        function createRouteA(done) {
                            service.route.create(userAId, done);
                        },
                        function createRouteB(done) {
                            setTimeout(function () {
                                service.route.create(userAId, done);
                            }, 1000);
                        }
                    ], done);
                },
                findRoutes: function (done) {
                    server.get('/api/routes?sortDirection=asc')
                        .expect(200)
                        .end(function (err, res) {
                            done(err, res.body);
                        });
                }
            }, function (err, results) {
                done(err);
                var routes = results.findRoutes;
                routes.length.should.be.above(1);
                for (var i = 0; i < routes.length - 1; i++) {
                    var first = new Date(routes[i].created),
                        next = new Date(routes[i + 1].created);
                    first.should.be.below(next);
                }
            });
        });
    });

    describe('GET /routes/:routeId', function () {
        it('should retrieve a route without error', function (done) {
            async.waterfall([
                function createRoute(done) {
                    service.route.create(userAId, function (err, route) {
                        done(err, route._id);
                    });
                },
                function loadRoute(routeId, done) {
                    server.get('/api/routes/' + routeId)
                        .expect(200)
                        .end(function (err, res) {
                            var route = res.body;
                            done(err, route);
                        });
                }
            ], function (err, route) {
                route._id.should.be.type('string');
                done(err);
            });
        });
    });

    describe('PUT /routes/:routeId', function () {
        it('should update a route without error', function (done) {
            async.waterfall([
                function createRoute(done) {
                    service.route.create(userAId, function (err, route) {
                        done(err, route._id);
                    });
                },
                function updateRoute(routeId, done) {
                    var updateData = service.route.getUpdateData();

                    server.put('/api/routes/' + routeId)
                        .set('userId', userAId)
                        .send(updateData)
                        .expect(200)
                        .end(function (err, res) {
                            done(err, res.body);
                        });
                }
            ], function (err, route) {
                done(err);
                route.creator._id.should.equal(userAId);
            });
        });

        it('should fail to update a route of another user', function (done) {
            async.waterfall([
                function createRoute(done) {
                    service.route.create(userAId, function (err, route) {
                        done(err, route._id);
                    });
                },
                function updateRoute(routeId, done) {
                    var updateData = service.route.getUpdateData();

                    server.put('/api/routes/' + routeId)
                        .set('userId', userBId)
                        .send(updateData)
                        .expect(401)
                        .end(function (err, res) {
                            var route = res.body;
                            done(err, route);
                        });
                }
            ], done);
        });
    });

    describe('DELETE /routes/:routeId', function () {
        it('should deactivate route without error', function (done) {
            async.waterfall([
                function createRoute(done) {
                    service.route.create(userAId, function (err, route) {
                        done(err, route._id);
                    });
                },
                function deleteRoute(routeId, done) {
                    server.del('/api/routes/' + routeId)
                        .set('userId', userAId)
                        .expect(200)
                        .end(function (err) {
                            done(err, routeId);
                        });
                },
                function loadRoute(routeId, done) {
                    server.get('/api/routes/' + routeId)
                        .expect(200)
                        .end(function (err, res) {
                            var route = res.body;
                            done(err, route);
                        });
                }
            ], function (err, route) {
                route.active.should.be.false;
                done(err);
            });
        });

        it('should fail to deactivate route of another user', function (done) {
            async.waterfall([
                function createRoute(done) {
                    service.route.create(userAId, function (err, route) {
                        done(err, route._id);
                    });
                },
                function deleteRoute(routeId, done) {
                    server.del('/api/routes/' + routeId)
                        .set('userId', userBId)
                        .expect(401)
                        .end(done);
                },
            ], done);
        });

    });
});