var request = require("request");
var _ = require("underscore");
var async = require("async");

var userCredintials = {
	  "email" : "email@email.com",
	  "password": "password"
};


request({
	method: "PUT",
	// jar: true,
	url: "http://localhost:3000/api/profile",
	// jar: true,
	json: userCredintials,
}, function(err, response, body) {
	console.log(response.statusCode);
	console.log(body);
});