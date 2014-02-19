'use strict';

angular.module('autostop.trips').controller('TripsController', [ '$scope', '$rootScope', '$modal', 'Trips', function ($scope, $rootScope, $modal, Trips) {
    $scope.trips = Trips.query();

    $rootScope.$on('trip-create-request', function (ev, data) {
        $scope.create(data.route);
    });

    $scope.create = function (route) {
        var modal = $modal.open({
            templateUrl: 'views/trips/item.html',
            controller: CreateTripModalController,
            resolve: {
                route: function () {
                    return route;
                }
            }
        });

        modal.result.then(function (trip) {
            $scope.trips.splice(0, 0, trip);
            $scope.trips.splice()
        });
    };

    function CreateTripModalController($scope, $modalInstance, route) {
        $scope.route = route;
        $scope.trip = {
            route: route._id,
            start: getNextHour(),
            seats: 3,
            note: ''
        };

        $scope.today = function () {
            var start = $scope.trip.start || getNextHour();
            var now = new Date();
            $scope.trip.start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), start.getHours(), start.getMinutes());
        };

        $scope.tomorrow = function () {
            var start = $scope.trip.start || getNextHour();
            var now = new Date();
            $scope.trip.start = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, start.getHours(), start.getMinutes());
        };

        $scope.ok = function () {
            var trip = new Trips($scope.trip);
            trip.$save(function (trip) {
                $modalInstance.close(trip);
            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        function getNextHour() {
            var now = new Date();
            return new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 0);
        }
    }
}]);