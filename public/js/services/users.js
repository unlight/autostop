'use strict';

angular.module('autostop.users').factory('Users', ['$resource', '$http', '$log', function ($resource, $http, $log) {
    var Users = $resource('/api/users/:userId', {
        userId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });

    Users.login = function (email, password) {
        return $http.post('/login', { email: email, password: password}, function (user) {
            $log.info('Success!');
            $log.info(user);
        })
        .error(function (err) {
            $log.warn('Error!');
            $log.warn(err);
        });
    };

    return Users;
}]);