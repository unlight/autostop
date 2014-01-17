'use strict';

var supertest = require('supertest'),
    server = supertest(require('../../../server')),
    should = require('should'),
    async = require('async'),
    uuid = require('node-uuid');

describe('Route service', function () {
    var userId;
    var userBid;

    before(function (done) {

        async.parallel([
            function createUser(done) {
                var createData = {
                    name: 'Name' + uuid.v1(),
                    username: 'username' + uuid.v1(),
                    email: 'email@host.com' + uuid.v1(),
                    password: 'qwerty'
                };

                server.post('/api/users')
                    .send(createData)
                    .expect(200)
                    .end(function (err, res) {
                        var userId = res.body;
                        done(err, userId);
                    });
            },
            function createUserB(done) {
                var createData = {
                    name: 'Name' + uuid.v1(),
                    username: 'username' + uuid.v1(),
                    email: 'email@host.com' + uuid.v1(),
                    password: 'qwerty'
                };

                server.post('/api/users')
                    .send(createData)
                    .expect(200)
                    .end(function (err, res) {
                        var userId = res.body;
                        done(err, userId);
                    });
            }
        ], function (err, results) {
            userId = results[0];
            userBid = results[1];
            done(err);
        });
    });

    describe('POST /routes', function () {
        it('should create a new route without error', function (done) {
            var createData = {
                title: 'Title',
                origin: 'Origin',
                destination: 'Destination'
            };

            server.post('/api/routes')
                .set('userId', userId)
                .send(createData)
                .expect(200)
                .end(function (err, res) {
                    var route = res.body;
                    route.creator.should.equal(userId);
                    done(err);
                });
        });

        it('should fail to create a route for not authenticated user', function (done) {
            var createData = {
                title: 'Title',
                origin: 'Origin',
                destination: 'Destination'
            };

            server.post('/api/routes')
                .send(createData)
                .expect(401)
                .end(done);
        });
    });

    describe('GET /routes/:routeId', function () {
        it('should retrieve a route without error', function (done) {
            async.waterfall([
                function createRoute(done) {
                    var createData = {
                        title: 'Title',
                        origin: 'Origin',
                        destination: 'Destination'
                    };

                    server.post('/api/routes')
                        .set('userId', userId)
                        .send(createData)
                        .expect(200)
                        .end(function (err, res) {
                            var route = res.body;
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
        it('should updates a route without error', function (done) {
            async.waterfall([
                function createRoute(done) {
                    var createData = {
                        title: 'Title',
                        origin: 'Origin',
                        destination: 'Destination'
                    };

                    server.post('/api/routes')
                        .set('userId', userId)
                        .send(createData)
                        .expect(200)
                        .end(function (err, res) {
                            var route = res.body;
                            done(err, route._id);
                        });
                },
                function updateRoute(routeId, done) {
                    var updateData = {
                        title: 'New Title',
                        origin: 'New Origin',
                        destination: 'New Destination'
                    };

                    server.put('/api/routes/' + routeId)
                        .set('userId', userId)
                        .send(updateData)
                        .expect(200)
                        .end(function (err, res) {
                            var route = res.body;
                            done(err, route);
                        });
                }
            ], function (err, route) {
                route.title.should.equal('New Title');
                done(err);
            });
        });

        it('should fails to update a route of another user', function (done) {
            async.waterfall([
                function createRoute(done) {
                    var createData = {
                        title: 'Title',
                        origin: 'Origin',
                        destination: 'Destination'
                    };

                    server.post('/api/routes')
                        .set('userId', userId)
                        .send(createData)
                        .expect(200)
                        .end(function (err, res) {
                            var route = res.body;
                            done(err, route._id);
                        });
                },
                function updateRoute(routeId, done) {
                    var updateData = {
                        title: 'New Title',
                        origin: 'New Origin',
                        destination: 'New Destination'
                    };

                    server.put('/api/routes/' + routeId)
                        .set('userId', userBid)
                        .send(updateData)
                        .expect(401)
                        .end(function (err, res) {
                            var route = res.body;
                            done(err, route);
                        });
                }
            ], done);
        })
    });
});