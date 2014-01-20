'use strict';

var supertest = require('supertest'),
    server = supertest(require('../../../server')),
    should = require('should'),
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
            service.trip.create(
                routeA.creator,
                { route: routeA._id },
                function (err, trip) {
                    trip.creator.should.equal(routeA.creator);
                    done(err);
                });
        });

        it('should fail for not authorized user', function (done) {
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
});