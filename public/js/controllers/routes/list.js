(function () {
    'use strict';

    angular.module('autostop.routes').controller('RouteListController',
        ['$scope', '$rootScope', '$log', '$modal', 'Global', 'Locations', 'Routes',
            function ($scope, $rootScope, $log, $modal, Global, Locations, Routes) {
                $scope.routes = Routes.query({
                    creator: Global.user._id
                });

                $scope.add = function () {
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
                        controller: EditRouteModalController,
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

                $scope.createTrip = function (route) {
                    $rootScope.$broadcast('trip-create-request', { route: route});
                };

                function EditRouteModalController($scope, $modalInstance, route) {
                    $scope.mode = 'edit';

                    $scope.route = {
                        id: route._id,
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

                        route.$update({ routeId: $scope.route.id }, function (route) {
                            $modalInstance.close(route);
                        });
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
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
})();