(function () {
    'use strict';

    angular.module('autostop.locations').factory('Locations', [ '$resource', function ($resource) {
        var Users = $resource('/api/locations/:locationId', {
            locationId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });

        return Users;
    }]);
})();