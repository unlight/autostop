'use strict';

/*jshint expr:true*/

require('should');

var supertest = require('supertest'),
    server = supertest(require('../../../server')),
    service = require('../service-helper')(server),
    async = require('async');

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

//        it('should be able to find title', function (done) {
//
//        });
//
//        it('should be able to find by creator', function (done) {
//
//        });
//
//        it('should be able to sort by title', function (done) {
//
//        });
    });
});