'use strict';

angular.module('autostop.routes').controller('RoutesController', ['$scope', '$log', '$modal', 'Locations', 'Routes', function ($scope, $log, $modal, Locations, Routes) {
    $scope.add = function () {
        $modal.open({
            templateUrl: 'views/routes/item.html',
            controller: ModalController
        });
    };

    function ModalController($scope, $modalInstance) {
        $scope.route = {};

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.locations = Locations.query(function (locations) {
            return locations;
        });

        $scope.title = function (origin, destination) {
            if (origin && destination) {
                return origin + ' - ' + destination;
            }
        };

        $scope.create = function (route, title) {
            route = new Routes({
                origin: route.origin._id,
                destination: route.destination._id,
                title: title
            });

            route.$save(function (route) {
                $log.info(route);
            });
        };
    }
}]);