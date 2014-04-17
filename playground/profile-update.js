var request = require("request");
var _ = require("underscore");
var async = require("async");

var request = request.defaults({jar: true});

var userCredintials = {
	  "email" : "email@email.com",
	  "password": "password"
};

async.waterfall([
	function() {
		var next = [].slice.call(arguments, -1)[0];
		request({
			method: "POST",
			url: "http://localhost:3000/api/users/signin",
			json: userCredintials,
		}, next);
	}, function() {
		var next = [].slice.call(arguments, -1)[0];
		var body = arguments[1];
		console.log("after signin");
		console.log(body);
		request({
			method: "GET",
			url: "http://localhost:3000/api/profile",
		}, next);
	}, function() {
		var next = [].slice.call(arguments, -1)[0];
		var body = arguments[1];
		console.log("after profile");
		console.log(body);
		request({
			method: "PUT",
			url: "http://localhost:3000/api/profile",
		}, next);
	}
], function(err) {
	if (err) throw err;
});
