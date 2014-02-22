(function () {
    'use strict';

    angular.module('autostop.routes').controller('RouteEditController',
        ['scope', 'modalInstance', 'Routes', 'route',
            function ($scope, $modalInstance, Routes, route) {
                $scope.mode = 'edit';

                $scope.route = {
                    _id: route._id,
                    origin: { id: route.origin._id, text: route.origin.title },
                    destination: { id: route.destination._id, text: route.destination.title }
                };

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

                    route.$update({ routeId: $scope.route._id }, function (route) {
                        $modalInstance.close(route);
                    });
                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            }
        ]);
})();