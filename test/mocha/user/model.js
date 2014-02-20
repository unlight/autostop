'use strict';
/*jshint expr:true*/

/**
 * Module dependencies.
 */
var should = require('should'),
    async = require('async'),
    mongoose = require('mongoose'),
    User = mongoose.model('User');

var user, user2;

describe('Model User:', function () {
    beforeEach(function (done) {
        user = new User({
            name: 'Full name',
            email: 'test@test.com',
            username: 'user',
            password: 'password',
            phone: 'phone number'
        });
        user2 = new User({
            name: 'Full name',
            email: 'test@test.com',
            username: 'user',
            password: 'password',
            phone: 'phone number'
        });

        User.remove({}, done);
    });

    describe('Method Save', function () {
        it('should begin with no users', function (done) {
            User.find({}, function (err, users) {
                users.should.have.length(0);
                done();
            });
        });

        it('should be able to save without problems', function (done) {
            user.save(done);
        });

        it('should be able to save with car property', function (done) {
            var car = {
                seats: 5,
                smokingAllowed: true,
                bodyType: 'hatch',
                color: 123,
                number: 456
            };

            async.series({
                createUser: function (done) {
                    user.car = car;
                    user.save(done);
                },
                loadUser: function (done) {
                    User.findById(user._id, done);
                }
            }, function (err, results) {
                var user = results.loadUser;
                user.car.should.eql(car);
                done(err);
            });

        });

        it('should fail to save an existing user again', function (done) {
            user.save();
            return user2.save(function (err) {
                should.exist(err);
                done();
            });
        });

        it('should be able to show an error when try to save without name', function (done) {
            user.name = '';
            return user.save(function (err) {
                should.exist(err);
                done();
            });
        });

        it('should show err when required field "phone" is omitted', function (done) {
            user.phone = '';
            return user.save(function(err) {
                should.exist(err);
                done();
            });
        });

    });

    describe('Method update', function () {
        it('should update user without error', function (done) {
            var updateData = {
                name: 'New user name',
                email: 'new_email@host.com'
            };

            async.series({
                createUser: function (done) {
                    user.save(done);
                },
                updateUser: function (done) {
                    user.update(updateData, done);
                },
                loadUser: function (done) {
                    User.findById(user._id, done);
                }
            }, function (err, results) {
                done(err);
                var updatedUser = results.loadUser;
                updatedUser.name.should.equal(updateData.name);
                updatedUser.email.should.equal(updateData.email);
            });
        });

        it('should be able to update car property', function (done) {
            var updateData = {
                car: {
                    seats: 5
                }
            };

            async.series({
                createUser: function (done) {
                    user.save(done);
                },
                updateUser: function (done) {
                    user.update(updateData, done);
                },
                loadUser: function (done) {
                    User.findById(user._id, done);
                }
            }, function (err, results) {
                done(err);
                var user = results.loadUser;
                user.car.should.eql(updateData.car);
            });
        });

        it('should be able to delete car property', function (done) {
            async.series({
                createUser: function (done) {
                    user.car = {
                        seats: 5
                    };
                    user.save(function (err, user) {
                        user.car.seats.should.equal(5);
                        done(err);
                    });
                },
                updateUser: function (done) {
                    user.update({ car: null }, done);
                },
                loadUser: function (done) {
                    User.findById(user._id, done);
                }
            }, function (err, results) {
                done(err);
                var user = results.loadUser;
                should.not.exist(user.car);
            });
        });

        it('should not affect security properties', function (done) {
            var updateData = {
                name: 'New user name',
                username: 'NewUsername'
            };

            async.series({
                createUser: function (done) {
                    user.save(done);
                },
                updateUser: function (done) {
                    user.update(updateData, done);
                },
                loadUser: function (done) {
                    User.findById(user._id, done);
                }
            }, function (err, results) {
                done(err);
                var updatedUser = results.loadUser;
                updatedUser.name.should.equal(updateData.name);
                updatedUser.username.should.equal(user.username);
            });
        });
    });
});

after(function (done) {
    User.remove().exec();
    done();
});