var request = require("request");

var res = request({
	method: "GET",
	url: "http://localhost:3000/api/users",
	json: {},
}, function(err, response, body) {
	console.log(body);
});
