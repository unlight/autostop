'use strict';

angular.module('autostop.routes').controller('RoutesController', ['$scope', '$log', '$modal', 'Locations', 'Routes', function ($scope, $log, $modal, Locations, Routes) {
    $scope.routes = Routes.query();

    $scope.add = function () {
        var modal = $modal.open({
            templateUrl: 'views/routes/item.html',
            controller: ModalController
        });

        modal.result.then(function (route) {
            console.log(route);
            $scope.routes.push(route);
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

        $scope.select2Options = {
            createSearchChoice: function (term) {
                return { id: term, text: term }
            },
            initSelection: function (element, callback) {
                var data = { id: element.val(), text: element.val() };
                callback(data);
            },
            query: function (query) {
                query.callback({
                    results: []
                });
            }
        };

        $scope.title = function (origin, destination) {
            if (origin && destination) {
                return origin + ' - ' + destination;
            }
        };

        $scope.create = function (route, title) {
            route = new Routes({
                origin: { title: route.origin.text },
                destination: { title: route.destination.text },
                title: title
            });

            route.$save(function (route) {
                $modalInstance.close(route);
            });
        };
    }
}]);