(function () {
    'use strict';

    angular.module('autostop.routes').controller('RouteCreateController',
        ['$scope', '$modalInstance', 'Routes',
            function ($scope, $modalInstance, Routes) {
                $scope.mode = 'create';
                $scope.route = {};

                $scope.title = function () {
                    var route = $scope.route;

                    if (route.origin && route.destination) {
                        return route.origin.text + ' - ' + route.destination.text;
                    }
                };

                $scope.ok = function () {
                    var route = $scope.route;
                    var origin = route.origin.id ?
                        route.origin.id : { title: route.origin.text };
                    var destination = route.destination.id ?
                        route.destination.id : { title: route.destination.text };

                    route = new Routes({
                        origin: origin,
                        destination: destination,
                        title: $scope.title()
                    });

                    route.$save(function (route) {
                        $modalInstance.close(route);
                    });

                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            }
        ]);
})();