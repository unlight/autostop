var request = require("request");

var res = request({
	method: "POST",
	url: "http://localhost:3000/api/users/signin",
	json: {
		"email": 'test@test.com',
		"password": 'password'
	},
}, function(err, response, body) {
	console.log(body);
	console.log(response.statusCode);
});



// var res = request({
// 	method: "PUT",
// 	url: "http://localhost:3000/api/profile",
// 	json: {},
// }, function(err, response, body) {
// 	console.log(body);
// });
