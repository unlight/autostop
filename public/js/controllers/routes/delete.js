(function () {
    'use strict';

    angular.module('autostop.routes').controller('RouteDeleteController',
        ['scope', 'modalInstance', 'route',
            function ($scope, $modalInstance, route) {
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
        ]);
})();