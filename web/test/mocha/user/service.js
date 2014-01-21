'use strict';

var supertest = require('supertest'),
    server = supertest(require('../../../server')),
    should = require('should'),
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
                .end(function(err, res) {
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
                function createUser (done) {
                    var createData = {
                        name: 'Name' + uuid.v1(),
                        username: 'username' + uuid.v1(),
                        email: 'email@host.com' + uuid.v1(),
                        password: 'qwerty'
                    };

                    server.post('/api/users')
                        .send(createData)
                        .expect(200)
                        .end(function(err, res) {
                            done(err, res.body);
                        });
                },
                function loadUser (user, done) {
                    server.get('/api/users/' + user._id)
                        .expect(200)
                        .end(function(err, res){
                            done(err, user._id, res.body);
                        });
                }
            ], function (err, userId, user) {
                done(err);
                user._id.should.equal(userId);
            });
        });
    });
});