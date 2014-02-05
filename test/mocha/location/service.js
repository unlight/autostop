'use strict';

/*jshint expr:true*/

require('should');

var supertest = require('supertest'),
    server = supertest(require('../../../server')),
    service = require('../service-helper')(server),
    async = require('async'),
    uuid = require('node-uuid');

describe('Location service', function () {
    var user;

    before(function (done) {
        service.user.create(function (err, createdUser) {
            done(err);
            user = createdUser;
        });
    });

    describe('POST /locations', function () {
        it('should create location without error', function (done) {
            var createData = service.location.getCreateData();
            server.post('/api/locations')
                .set('userId', user._id)
                .send(createData)
                .expect(200)
                .end(function (err, res) {
                    done(err);
                    var location = res.body;
                    location._id.should.exist;
                    location.creator._id.should.equal(user._id);
                });
        });

        it('should fail for unauthenticated request', function (done) {
            var createData = service.location.getCreateData();
            server.post('/api/locations')
                .send(createData)
                .expect(401)
                .end(done);
        });
    });

    describe('GET /locations', function () {
        it('should return all locations', function (done) {
            async.series({
                createLocation: function (done) {
                    service.location.create(user._id, done);
                },
                findLocations: function (done) {
                    server.get('/api/locations')
                        .expect(200)
                        .end(function (err, res) {
                            done(err, res.body);
                        });
                }
            }, function (err, results) {
                done(err);
                var locations = results.findLocations;
                locations.length.should.be.above(0);
            });
        });

        it('should be able to find by title', function (done) {
            var token = uuid.v1(),
                title = 'Head' + token + 'Tail';

            async.series({
                createLocations: function (done) {
                    async.parallel([
                        function createLocationA(done) {
                            service.location.create(user._id, done);
                        },
                        function createLocationB(done) {
                            var createData = service.location.getCreateData();
                            createData.title = title;
                            server.post('/api/locations')
                                .set('userId', user._id)
                                .send(createData)
                                .expect(200)
                                .end(done);
                        }
                    ], done);
                },
                findLocations: function (done) {
                    server.get('/api/locations?title=' + title)
                        .expect(200)
                        .end(function (err, res) {
                            done(err, res.body);
                        });
                }
            }, function (err, results) {
                done(err);
                var locations = results.findLocations;
                locations.length.should.equal(1);
                locations[0].title.should.equal(title);
            });
        });

        it('should be able to find by creator', function (done) {
            var userB;

            async.series({
                createUser: function (done) {
                    service.user.create(function (err, user) {
                        userB = user;
                        done(err);
                    });
                },
                createLocations: function (done) {
                    async.parallel([
                        function createLocationA(done) {
                            service.location.create(user._id, done);
                        },
                        function createLocationB(done) {
                            service.location.create(userB._id, done);
                        }
                    ], done);
                },
                findLocations: function (done) {
                    server.get('/api/locations?creator=' + userB._id)
                        .expect(200)
                        .end(function (err, res) {
                            done(err, res.body);
                        });
                }
            }, function (err, results) {
                done(err);
                var locations = results.findLocations;
                locations.length.should.equal(1);
                locations[0].creator._id.should.equal(userB._id);
            });
        });

        it('should be able to sort by title', function (done) {
            async.series({
                createLocations: function (done) {
                    async.parallel([
                        function createLocationA(done) {
                            var createData = service.location.getCreateData();
                            createData.title = 'Location A';
                            server.post('/api/locations')
                                .set('userId', user._id)
                                .send(createData)
                                .expect(200)
                                .end(done);
                        },
                        function createLocationB(done) {
                            var createData = service.location.getCreateData();
                            createData.title = 'Location B';
                            server.post('/api/locations')
                                .set('userId', user._id)
                                .send(createData)
                                .expect(200)
                                .end(done);
                        }
                    ], done);
                },
                findLocations: function (done) {
                    async.parallel([
                        function asc(done) {
                            server.get('/api/locations?sortBy=title&sortDirection=asc')
                                .expect(200)
                                .end(function (err, res) {
                                    done(err, res.body);
                                });
                        },
                        function desc(done) {
                            server.get('/api/locations?sortBy=title&sortDirection=desc')
                                .expect(200)
                                .end(function (err, res) {
                                    done(err, res.body);
                                });
                        }
                    ], done);
                }
            }, function (err, results) {
                done(err);
                var locationsAsc = results.findLocations[0],
                    locationsDesc = results.findLocations[1];

                locationsAsc.length.should.be.above(1);
                for(var i = 0; i < locationsAsc.length - 1; i++) {
                    (locationsAsc[i].title <= locationsAsc[i + 1].title).should.be.ok;
                }

                locationsDesc.length.should.be.above(1);
                for(i = 0; i < locationsDesc.length - 1; i++) {
                    (locationsDesc[i].title >= locationsDesc[i + 1].title).should.be.ok;
                }
            });

        });
    });
});