'use strict';

angular.module('autostop.routes').factory('Routes', [ '$resource', function ($resource) {
    var Routes = $resource('/api/routes/:routeId', {
        routeId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });

    return Routes;
}]);