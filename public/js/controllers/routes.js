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
                return { id: 0, text: term }
            },
            initSelection: function (element, callback) {
                var data = { id: element.select2('data').id, text: element.select2('data').text };
                callback(data);
            },
            query: function (query) {
                var searchCriteria = {};
                if (query.term) {
                    searchCriteria.title = query.term;
                }

                Locations.query(searchCriteria, function (locations) {
                    var results = $.map(locations, function (location) {
                        return { id: location._id, text: location.title }
                    });

                    query.callback({
                        results: results
                    });
                });
            }
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
}]);