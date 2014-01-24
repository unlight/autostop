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

//The tests
describe('<Unit Test>', function () {
    describe('Model User:', function () {
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
        });

        describe('Method update', function () {
            it('should not update security properties', function (done) {
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

        after(function (done) {
            User.remove().exec();
            done();
        });
    });
});