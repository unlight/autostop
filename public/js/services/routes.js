(function () {
    'use strict';

    angular.module('autostop.routes').factory('Routes', [ '$resource', function ($resource) {
        var Routes = $resource('/api/routes/:routeId', {
            routeId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });

        /**
         * Returns default title of the route, based on origin and destination's titles.
         * @param origin Title of origin. May be empty.
         * @param destination Title of destination. May be empty.
         * @returns {String}
         */
        Routes.title = function (origin, destination) {
            if (origin) {
                if (destination) {
                    return origin + ' - ' + destination;
                }
                return origin;
            }

            return destination || '';
        };

        return Routes;
    }]);
})();