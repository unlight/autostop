'use strict';

angular.module('autostop.routes').controller('RoutesController', ['$scope', '$log', '$modal', 'Locations', 'Routes', function ($scope, $log, $modal, Locations, Routes) {
    $scope.routes = Routes.query();

    $scope.add = function () {
        var modal = $modal.open({
            templateUrl: 'views/routes/item.html',
            controller: CreateRouteModalController
        });

        modal.result.then(function (route) {
            $scope.routes.push(route);
        });
    };

    $scope.remove = function (route) {
        var modal = $modal.open({
            templateUrl: 'views/routes/remove.html',
            controller: RemoveRouteModalController,
            resolve: {
                route: function () {
                    return route;
                }
            }
        });

        modal.result.then(function (route) {
            var index = $scope.routes.indexOf(route);
            $scope.routes.splice(index, 1);
        });
    };

    function CreateRouteModalController($scope, $modalInstance) {
        $scope.route = {};

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.title = function (origin, destination) {
            if (origin && destination) {
                return origin + ' - ' + destination;
            }
        };

        $scope.create = function (route, title) {
            var origin = route.origin.id ?
                route.origin.id : { title: route.origin.text };

            var destination = route.destination.id ?
                route.destination.id : { title: route.destination.text };

            route = new Routes({
                origin: origin,
                destination: destination,
                title: title
            });

            route.$save(function (route) {
                $modalInstance.close(route);
            });
        };
    }

    function RemoveRouteModalController($scope, $modalInstance, route) {
        $scope.route = route;

        $scope.ok = function () {
            route.$delete(function () {
                $modalInstance.close(route);
            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
}]);