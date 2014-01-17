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
            var user = {
                name: 'Name' + uuid.v1(),
                username: 'username' + uuid.v1(),
                email: 'email@host.com' + uuid.v1(),
                password: 'qwerty'
            };

            server.post('/api/users')
                .send(user)
                .expect(200)
                .end(function(err, res) {
                    done(err);
                    res.body.should.be.type('string');
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
                    var user = {
                        name: 'Name' + uuid.v1(),
                        username: 'username' + uuid.v1(),
                        email: 'email@host.com' + uuid.v1(),
                        password: 'qwerty'
                    };

                    server.post('/api/users')
                        .send(user)
                        .expect(200)
                        .end(function(err, res) {
                            res.body.should.be.type('string');
                            done(err, res.body);
                        });
                },
                function loadUser (userId, done) {
                    server.get('/api/users/' + userId)
                        .expect(200)
                        .end(function(err, res){
                            done(err, res.body);
                        });
                }
            ], function (err, user) {
                done(err);
                user.should.be.type('object');
            });
        });
    });
});