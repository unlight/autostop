'use strict';

angular.module('autostop.users').factory('Users', ['$resource', function ($resource) {
    return $resource('/api/users/:userId', {
        userId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);