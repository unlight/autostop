'use strict';

var supertest = require('supertest'),
    server = supertest(require('../../../server')),
    should = require('should'),
    async = require('async'),
    uuid = require('node-uuid');

describe('Route service', function () {
    var userId;

    before(function (done) {
        var userCreateData = {
            name: 'Name' + uuid.v1(),
            username: 'username' + uuid.v1(),
            email: 'email@host.com' + uuid.v1(),
            password: 'qwerty'
        };

        server.post('/api/users')
            .send(userCreateData)
            .expect(200)
            .end(function (err, res) {
                userId = res.body;
                should.exist(userId);
                done(err);
            });
    });

    describe('POST /routes', function () {
        it('creates a new route without error', function (done) {
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

        it('failed to create a route for not authenticated user', function (done) {
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
        it('retrieves a route without an error', function (done) {
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
});