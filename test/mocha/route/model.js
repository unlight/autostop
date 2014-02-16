'use strict';

/*jshint expr: true*/
require('../../../server');

var should = require('should'),
    async = require('async'),
    mongoose = require('mongoose'),
    entity = require('../entity-helper'),
    _ = require('underscore'),
    Route = mongoose.model('Route');

var user;
var route;
var locationA;
var locationB;

describe('Model Route:', function () {
    before(function (done) {
        async.series({
            removeAllRoutes: function (callback) {
                Route.remove({}, callback);
            },
            createUser: function (callback) {
                user = entity.user();
                user.save(callback);
            },
            createLocations: function (callback) {
                async.parallel([
                    function createLocationA(done) {
                        locationA = entity.location({creator: user._id});
                        locationA.save(done);
                    },
                    function createLocationB(done) {
                        locationB = entity.location({creator: user._id});
                        locationB.save(done);
                    }
                ], callback);
            }
        }, done);
    });

    beforeEach(function (done) {
        route = entity.route({ creator: user, origin: locationA, destination: locationB });
        done();
    });

    describe('Method save', function () {
        it('should be able to save without problems', function (done) {
            return route.save(function (err) {
                done(err);
            });
        });

        it('should be able to save optional properties', function (done) {
            route.icon = 'Icon';
            route.seats = 5;
            route.start = new Date(1, 1, 1, 18, 55);

            route.save(function (err, route) {
                done(err);
                route.icon.should.equal('Icon');
                route.seats.should.equal(5);
                route.start.should.eql(new Date(1, 1, 1, 18, 55));
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
                var route = results.loadRoute;
                route.creator.should.be.an.instanceof(mongoose.model('User'));
                route.origin.should.be.an.instanceof(mongoose.model('Location'));
                route.destination.should.be.an.instanceof(mongoose.model('Location'));
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
                    route.origin.should.be.an.instanceof(mongoose.model('Location'));
                    route.destination.should.be.an.instanceof(mongoose.model('Location'));
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
                    userB = entity.user();
                    userB.save(callback);
                },
                saveRouteB: function (callback) {
                    routeB = entity.route({ creator: userB });
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

        it('should be able to sort routes by creation date', function (done) {
            this.timeout(3000);
            async.series({
                createRouteA: function (done) {
                    route.save(done);
                },
                createRouteB: function (done) {
                    setTimeout(function () {
                        var routeB = entity.route({ creator: user });
                        routeB.save(done);
                    }, 1000);
                },
                findRoutes: function (done) {
                    async.parallel([
                        function sortAsc(done) {
                            Route.search({
                                sortBy: 'created',
                                sortDirection: 'asc'
                            }, done);
                        },
                        function sortDesc(done) {

                            Route.search({
                                sortBy: 'created',
                                sortDirection: 'desc'
                            }, done);
                        }
                    ], done);
                }
            }, function (err, results) {
                done(err);
                var routes = results.findRoutes,
                    routesAsc = routes[0],
                    routesDesc = routes[1];

                routesAsc.length.should.be.above(1);
                for (var i = 0; i < routesAsc.length - 1; i++) {
                    routesAsc[i].created.should.be.below(routesAsc[i + 1].created);
                }

                routesDesc.length.should.be.above(1);
                for (i = 0; i < routesDesc.length - 1; i++) {
                    routesDesc[i].created.should.be.above(routesDesc[i + 1].created);
                }
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