'use strict';

/*jshint expr: true*/
require('../../../server');

var should = require('should'),
    async = require('async'),
    mongoose = require('mongoose'),
    mock = require('../mock'),
    _ = require('underscore'),
    Route = mongoose.model('Route');

var user;
var route;

describe('Model Route:', function () {
    before(function (done) {
        async.series({
            removeAllRoutes: function (callback) {
                Route.remove({}, callback);
            },
            createUser: function (callback) {
                user = mock.user();
                user.save(callback);
            }
        }, done);
    });

    beforeEach(function (done) {
        route = mock.route({ creator: user });
        done();
    });

    describe('Method save', function () {
        it('should be able to save without problems', function (done) {
            return route.save(function (err) {
                done(err);
            });
        });

        it('should be able to show an error when try to save without title', function (done) {
            route.title = '';
            route.save(function (err) {
                should.exist(err);
                done();
            });
        });

        it('should be able to show an error when try to save without origin', function (done) {
            route.origin = '';
            route.save(function (err) {
                should.exist(err);
                done();
            });
        });

        it('should be able to show an error when try to save without destination', function (done) {
            route.destination = '';
            route.save(function (err) {
                should.exist(err);
                done();
            });
        });

        it('should be able to show an error when try to save without user', function (done) {
            route.creator = null;
            route.save(function (err) {
                should.exist(err);
                done();
            });
        });
    });

    describe('Method load', function () {
        it('should populate referenced properties', function (done) {
            async.series({
                saveRoute: function (callback) {
                    route.save(callback);
                },
                loadRoute: function (callback) {
                    Route.load(route._id, callback);
                }
            }, function (err, results) {
                results.loadRoute.creator.should.be.an.instanceof(mongoose.model('User'));
                done(err);
            });
        });
    });

    describe('Method search', function () {
        beforeEach(function (done) {
            Route.remove({}).exec(function (err) {
                done(err);
            });
        });

        it('should be able to return all routes by default', function (done) {
            async.series({
                saveRoute: function (callback) {
                    route.save(callback);
                },
                findRoutes: function (callback) {
                    Route.search({}, callback);
                }
            }, function (err, results) {
                results.findRoutes.length.should.equal(1);
                done(err);
            });
        });

        it('should populate referenced properties', function (done) {
            async.series({
                saveRoute: function (callback) {
                    route.save(callback);
                },
                findRoutes: function (callback) {
                    Route.search({}, callback);
                }
            }, function (err, results) {
                var routes = results.findRoutes;

                routes.length.should.be.above(0);
                _.each(routes, function (route) {
                    route.creator.should.be.an.instanceof(mongoose.model('User'));
                });
                done(err);
            });
        });

        it('should not return inactive routes by default', function (done) {
            async.series({
                saveRoute: function (callback) {
                    route.save(callback);
                },
                deactivateRoute: function (callback) {
                    route.deactivate(callback);
                },
                findRoutes: function (callback) {
                    Route.search({}, callback);
                }
            }, function (err, results) {
                var routes = results.findRoutes;
                routes.length.should.equal(0);
                done(err);
            });
        });


        it('should be able to return inactive routes', function (done) {
            async.series({
                saveRoute: function (callback) {
                    route.save(callback);
                },
                deactivateRoute: function (callback) {
                    route.deactivate(callback);
                },
                findRoutes: function (callback) {
                    Route.search({ includeInactive: true }, callback);
                }
            }, function (err, results) {
                var routes = results.findRoutes;
                routes.length.should.equal(1);
                done(err);
            });
        });

        it('should be able to filter routes by creator', function (done) {
            var userB;
            var routeB;

            async.series({
                saveRoute: function (callback) {
                    route.save(callback);
                },
                saveUserB: function (callback) {
                    userB = mock.user();
                    userB.save(callback);
                },
                saveRouteB: function (callback) {
                    routeB = mock.route({ creator: userB });
                    routeB.save(callback);
                },
                findRoutes: function (callback) {
                    Route.search({ creator: userB._id }, callback);
                }
            }, function (err, results) {
                var routes = results.findRoutes;
                routes.length.should.equal(1);
                done(err);
            });
        });
    });

    describe('Method deactivate', function () {
        it('should be able to deactive a route without problems', function (done) {
            async.series({
                saveRoute: function (callback) {
                    route.save(callback);
                },
                deactivateRoute: function (callback) {
                    route.deactivate(callback);
                },
                loadRoute: function (callback) {
                    Route.load(route._id, callback);
                }
            }, function (err, results) {
                var route = results.loadRoute;
                route.active.should.be.false;
                done(err);
            });
        });
    });

    afterEach(function (done) {
        Route.remove({});
        done();
    });
    after(function (done) {
        Route.remove().exec();
        done();
    });
});