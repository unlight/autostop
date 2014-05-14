'use strict';

/* jshint ignore: start */

var should = require('should'),
    async = require('async'),
    mongoose = require('mongoose'),
    User = mongoose.model('User');

var user;
var userId;

before(function (done) {
    user = new User({
        name: 'Dummy',
        email: 'dUmMy@TeSt.COM',
        username: 'Dummy',
        password: 'password',
        phone: 'phone'
    });
    userId = user._id;
    User.remove({}, done);
});

after(function (done) {
    User.remove({}).exec();
    done();
});

describe('User Login', function () {

    var findUser = function(login, done) {
        User.findByLogin(login, function (error, doc) {
            if (error) throw error;
            doc.should.be.ok;
            doc._id.toString().should.equal(userId.toString());
            done();
        });
    }

    it("should add user", function (done) {
        user.save(done);
    });

    it("should user exists", function (done) {
        userId.should.be.not.empty;
        User.findById(userId, function (err, doc) {
            doc.should.be.ok;
            doc._id.toString().should.equal(userId.toString());
            done();
        });
    });


    it("should found user with all uppercased value", function (done) {
        findUser("DUMMY@TEST.COM", done);
    });

    it("should found user with all lowercased", function (done) {
        findUser("dummy@test.com", done);
    });

    it("should found user with mixed case", function (done) {
        findUser("dUmMy@TeSt.COM", done);
    });

});

/* jshint ignore: end */