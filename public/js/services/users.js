'use strict';

angular.module('autostop.users').factory('Users', ['$resource', '$http', function ($resource, $http) {
    var Users = $resource('/api/users/:userId', {
        userId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });

    Users.login = function (email, password) {
        return $http.post('/api/users/signin', { email: email, password: password});
    };

    return Users;
}]);