'use strict';
/*jshint expr:true*/

/**
 * Module dependencies.
 */
var should = require('should'),
    async = require('async'),
    mongoose = require('mongoose'),
    User = mongoose.model('User');

//Globals
var user, user2;

describe.only('Model User:', function () {
    beforeEach(function (done) {
        user = new User({
            name: 'Full name',
            email: 'test@test.com',
            username: 'user',
            password: 'password'
        });
        user2 = new User({
            name: 'Full name',
            email: 'test@test.com',
            username: 'user',
            password: 'password'
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

        it('should be able to save whithout problems', function (done) {
            user.save(done);
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

        it('should not affect car property', function (done) {
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
                var updatedUser = results.loadUser;
                should.not.exist(updatedUser.car);
            });
        });
    });

    describe('Method update car', function () {
        it('should update car without error', function (done) {
            var saveData = {
                seats: 5,
                smokingAllowed: true,
                bodyType: 'hatch',
                color: 0,
                number: '123'
            };

            async.series({
                createUser: function (done) {
                    user.save(done);
                },
                createCar: function (done) {
                    user.saveCar(saveData, done);
                },
                loadUser: function (done) {
                    User.findById(user._id, done);
                }
            }, function (err, results) {
                done(err);
                var user = results.loadUser;
                user.car.seats.should.equal(saveData.seats);
                user.car.smokingAllowed.should.equal(saveData.smokingAllowed);
                user.car.bodyType.should.equal(saveData.bodyType);
                user.car.color.should.equal(saveData.color);
                user.car.number.should.equal(saveData.number);
            });
        });
    });

    describe('Method delete car', function () {
        it('should delete car without error', function (done) {
            async.series({
                createUser: function (done) {
                    user.save(done);
                },
                createCar: function (done) {
                    var saveData = {
                        seats: 5
                    };
                    user.saveCar(saveData, done);
                },
                deleteCar: function (done) {
                    user.deleteCar(done);
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
    });
});

after(function (done) {
    User.remove().exec();
    done();
});