'use strict';

angular.module('autostop.trips').controller('TripsController', [ '$scope', '$rootScope', '$modal', 'Trips', function ($scope, $rootScope, $modal, Trips) {
    function getNextHour() {
        var now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 0);
    }

    function today(date) {
        var now = new Date();
        date = date || getNextHour();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate(), date.getHours(), date.getMinutes());
    };

    function tomorrow(date) {
        var now = new Date();
        date = date || getNextHour();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, date.getHours(), date.getMinutes());
    };

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
            $scope.trips.splice();
        });
    };

    $scope.edit = function (trip) {
        var modal = $modal.open({
            templateUrl: 'views/trips/item.html',
            controller: EditTripModalController,
            resolve: {
                trip: function () {
                    return trip;
                }
            }
        });

        modal.result.then(function (updatedTrip) {
            var index = $scope.trips.indexOf(trip);
            $scope.trips.splice(index, 1, updatedTrip);
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
            $scope.trip.start = today($scope.trip.start);
        };

        $scope.tomorrow = function () {
            $scope.trip.start = tomorrow($scope.trip.start);
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
    }

    function EditTripModalController($scope, $modalInstance, trip) {
        $scope.trip = _.extend(trip, {
            start: new Date(trip.start)
        });

        $scope.route = trip.route;

        $scope.today = function () {
            $scope.trip.start = today($scope.trip.start);
        };

        $scope.tomorrow = function () {
            $scope.trip.start = tomorrow($scope.trip.start);
        };

        $scope.ok = function () {
            var trip = new Trips({
                start: $scope.trip.start,
                seats: $scope.trip.seats,
                note: $scope.trip.note
            });

            trip.$update({ tripId: $scope.trip._id }, function (trip) {
                $modalInstance.close(trip);
            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
}]);