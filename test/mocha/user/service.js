'use strict';
/*jshint expr:true*/

require('should');

var supertest = require('supertest'),
    server = supertest(require('../../../server')),
    service = require('../service-helper')(server),
    uuid = require('node-uuid'),
    async = require('async'),
    _ = require('underscore');

describe('User service', function () {
    describe('POST /users', function () {
        it('should create user without problem', function (done) {
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
                    done(err);
                    var user = res.body;
                    user._id.should.exist;
                    user.name.should.equal(createData.name);
                });
        });
    });

    describe('GET /users', function () {
        it('should return users', function (done) {
            server.get('/api/users')
                .expect(200)
                .end(function (err, res) {
                    done(err);
                    _.isArray(res.body).should.be.true;
                });
        });
    });

    describe('GET /users/:userId', function () {
        it('should return user by id', function (done) {
            async.waterfall([
                function createUser(done) {
                    service.user.create(done);
                },
                function loadUser(user, done) {
                    server.get('/api/users/' + user._id)
                        .expect(200)
                        .end(function (err, res) {
                            done(err, user._id, res.body);
                        });
                }
            ], function (err, userId, user) {
                done(err);
                user._id.should.equal(userId);
            });
        });
    });

    describe('PUT /users/:userId', function () {
        it('should update user without error', function (done) {
            async.waterfall([
                function createUser(done) {
                    service.user.create(done);
                },
                function updateUser(user, done) {
                    var updateData = service.user.getUpdateData();
                    server.put('/api/users/' + user._id)
                        .set('userId', user._id)
                        .send(updateData)
                        .expect(200)
                        .end(function (err, res) {
                            done(err, updateData, res.body);
                        });
                }
            ], function (err, updateData, user) {
                done(err);
                user.name.should.equal(updateData.name);
            });
        });

        it('should fail for not authenticated requests', function (done) {
            async.waterfall([
                function createUser(done) {
                    service.user.create(done);
                },
                function updateUser(user, done) {
                    var updateData = service.user.getUpdateData();
                    server.put('/api/users/' + user._id)
                        .send(updateData)
                        .expect(401)
                        .end(done);
                }
            ], done);
        });

        it('should fail if current user try to update another user', function (done) {
            async.waterfall([
                function createUserA(done) {
                    service.user.create(done);
                },
                function createUserB(userA, done) {
                    service.user.create(function (err, userB) {
                        done(err, userA, userB);
                    });
                },
                function updateUser(userA, userB, done) {
                    var updateData = service.user.getUpdateData();
                    server.put('/api/users/' + userA._id)
                        .set('userId', userB._id)
                        .send(updateData)
                        .expect(401)
                        .end(done);
                }
            ], done);
        });
    });
});