'use strict';

angular.module('autostop.users').controller('SignupController', [ '$scope', '$modal', function ($scope, $modal) {
    $scope.open = function () {
        $modal.open({
            templateUrl: 'views/users/signup.html',
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