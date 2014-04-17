var request = require("request");

var res = request({
	method: "POST",
	url: "http://localhost:3000/api/users",
	json: {
	  "name" : "name",
	  "email" : "email@email.com",
	  "username" : "username1",
	  "phone" : "phone number",
	  "password": "password"
	}
}, function(err, response, body) {
	console.log(err);
	console.log(response.statusCode);
	console.log(response.body);
	console.log(body);
});
