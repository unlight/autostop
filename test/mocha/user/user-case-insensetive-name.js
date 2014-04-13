/* jshint ignore:start */
var should = require('should');
var async = require('async');
var mongoose = require('mongoose');

var conf = require("../../../config/env/test.js");
mongoose.connect(conf.db);

require("../../../app/models/user.js");
var User = mongoose.model('User');

var user;

describe('Model User:', function () {
	beforeEach(function (done) {

		this.timeout(2000);

		user = new User({
			name: 'Full name',
			email: 'test@test.com',
			username: 'user',
			password: 'password',
			phone: 'phone number'
		});

		User.remove({}, done);
	});

	describe('Find user', function () {
		it('should begin with no users', function (done) {
			User.find({}, function (err, users) {
				users.should.have.length(0);
				done();
			});
		});

		it('should be able to save without problems', function (done) {
			user.save(done);
		});

		it('should find user without problems', function (done) {

			var collection = {
				save: function(done) {
					user.save(done);
				},
				find: function(done) {
					User.findOne({name: /full name/i }, done);
				},
			};

			async.series(collection, function(err, results) {
				should.not.exist(err);
				var dummy = results.find.should.be.ok;
				done();
			});
		});

	});
});