(function () {
    'use strict';

    angular.module('autostop.routes').controller('RouteCreateController',
        ['$scope', '$modalInstance', 'Routes',
            function ($scope, $modalInstance, Routes) {
                $scope.mode = 'create';
                $scope.route = {};

                $scope.title = function () {
                    var route = $scope.route;

                    var origin = route.origin && route.origin.text,
                        destination = route.destination && route.destination.text;
                    return Routes.title(origin, destination);
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