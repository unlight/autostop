(function () {
    'use strict';

    angular.module('autostop.trips').factory('Trips', [ '$resource', '$http', function ($resource, $http) {
        var Trips = $resource('/api/trips/:tripId', {
            tripId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });

		Trips.join = function(trip, callback){
			$http.post('/api/trips/' + trip._id + '/join').success(function(){
				callback(trip);
			});
		};
		
		Trips.leave = function(trip, callback){
			$http.post('/api/trips/' + trip._id + '/leave').success(function(){
				callback(trip);
			});
		};
		
        return Trips;
    }]);
})();