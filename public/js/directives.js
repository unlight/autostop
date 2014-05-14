(function () {
    'use strict';

    angular.module('autostop')
        .directive('selectLocation', function () {
            return {
                restrict: 'E',
                templateUrl: 'views/templates/select-location.html',
                scope: {
                    location: '=',
                    required: '='
                },
                controller: ['$scope', '$element', 'Locations', function ($scope, $element, Locations) {
                    $scope.options = {
                        createSearchChoice: function (term) {
                            return { id: 0, text: term };
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
                                var results = _.map(locations, function (location) {
                                    return { id: location._id, text: location.title };
                                });

                                query.callback({
                                    results: results
                                });
                            });
                        }
                    };
                }]
            };
        });
})();