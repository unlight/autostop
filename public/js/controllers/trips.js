'use strict';

angular.module('autostop.trips').controller('TripsController', [ '$scope', '$rootScope', function ($scope, $rootScope) {
    $scope.trips = [];

    $rootScope.$on('trip-create-request', function (ev, data) {
        $scope.create(data.route);
    });

    $scope.create = function (route) {
        console.log(route);
    };
}]);