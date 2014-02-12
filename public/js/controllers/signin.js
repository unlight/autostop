'use strict';

angular.module('autostop.users').controller('SigninController', ['$scope', '$modal', 'Global', function ($scope, $modal, Global) {
    $scope.open = function () {

        var modalInstance = $modal.open({
            templateUrl: 'views/users/signin.html',
            controller: function ($scope, $modalInstance) {
                $scope.ok = function () {
                    $modalInstance.close();
                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            }
        });
    };
}]);