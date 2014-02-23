(function () {
    'use strict';

    angular.module('autostop.routes').controller('RouteListController',
        ['$scope', '$rootScope', '$modal', 'Global', 'Routes',
            function ($scope, $rootScope, $modal, Global, Routes) {
                $scope.routes = Routes.query({
                    creator: Global.user._id
                });

                $scope.create = function () {
                    var modal = $modal.open({
                        templateUrl: 'views/routes/item.html',
                        controller: 'RouteCreateController'
                    });

                    modal.result.then(function (route) {
                        $scope.routes.splice(0, 0, route);
                    });
                };

                $scope.edit = function (route) {
                    var modal = $modal.open({
                        templateUrl: 'views/routes/item.html',
                        controller: 'RouteEditController',
                        resolve: {
                            route: function () {
                                return route;
                            }
                        }
                    });

                    modal.result.then(function (updatedRoute) {
                        var index = $scope.routes.indexOf(route);
                        $scope.routes.splice(index, 1, updatedRoute);
                    });
                };

                $scope.delete = function (route) {
                    var modal = $modal.open({
                        templateUrl: 'views/routes/delete.html',
                        controller: 'RouteDeleteController',
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

                $scope.createTrip = function (route) {
                    $rootScope.$broadcast('trip-create-request', { route: route});
                };
            }]);
})();