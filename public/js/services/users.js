'use strict';

angular.module('autostop.users').factory('Users', ['$resource', '$http', function ($resource, $http) {
    var Users = $resource('/api/users/:userId', {
        userId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });

    Users.signin = function (credentials) {
        return $http.post('/api/users/signin', { email: credentials.email, password: credentials.password });
    };

    return Users;
}]);