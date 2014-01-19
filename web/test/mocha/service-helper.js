'use strict';

var uuid = require('node-uuid'),
    _ = require('underscore');

var ServiceHelper = function (server) {
    this.user = {
        getCreateData: function (source) {
            return _.extend({
                name: 'Name',
                username: 'Username' + uuid.v1(),
                email: 'Email@host.com' + uuid.v1(),
                password: 'Password'
            }, source);
        },
        create: function (done) {
            var createData = this.getCreateData();

            server.post('/api/users')
                .send(createData)
                .expect(200)
                .end(function (err, res) {
                    var userId = res.body;
                    done(err, userId);
                });
        }
    };

    this.route = {
        getCreateData: function () {
            return {
                title: 'Title',
                origin: 'Origin',
                destination: 'Destination'
            };
        },
        updateData: function () {
            return {
                title: 'Title' + uuid.v1(),
                origin: 'Origin' + uuid.v1(),
                destination: 'Destination' + uuid.v1()
            };
        },
        create: function (userId, done) {
            var createData = this.getCreateData();

            server.post('/api/routes')
                .set('userId', userId)
                .send(createData)
                .expect(200)
                .end(function (err, res) {
                    done(err, res.body);
                });
        }
    };
};

module.exports = function (server) {
    return new ServiceHelper(server);
};