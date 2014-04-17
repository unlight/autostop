var request = require("request");

var res = request({
	method: "POST",
	url: "http://localhost:3000/api/users/signin",
	json: {
		"email": 'email@email.com',
		"password": 'password'
	},
}, function(err, response, body) {
	console.log(response.headers);
	console.log(response.statusCode);
	console.log(body);
});



// var res = request({
// 	method: "PUT",
// 	url: "http://localhost:3000/api/profile",
// 	json: {},
// }, function(err, response, body) {
// 	console.log(body);
// });
