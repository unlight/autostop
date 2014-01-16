'use strict';

var supertest = require('supertest'),
    server = supertest(require('../../../server.js')),
    should = require('should'),
    uuid = require('node-uuid');

describe.only('User service', function () {
    describe('Method create', function () {
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
});