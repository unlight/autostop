'use strict';

angular.module('autostop.routes').controller('RoutesController', ['$scope', '$modal', function ($scope, $modal) {
    $scope.add = function () {
        $modal.open({
            templateUrl: 'views/routes/item.html',
            controller: ModalController
        });
    };

    function ModalController($scope, $modalInstance) {
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
}]);