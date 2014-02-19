'use strict';

angular.module('autostop.trips').factory('Trips', [ '$resource', function ($resource) {
    var Trips = $resource('/api/trips/:tripId', {
        tripId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });

    return Trips;
}]);