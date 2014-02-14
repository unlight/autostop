'use strict';

angular.module('autostop.users').controller('SigninController', ['$scope', '$modal', '$log', 'Users', function ($scope, $modal, $log, Users) {
    $scope.open = function () {

        $modal.open({
            templateUrl: 'views/users/signin.html',
            controller: ModalController
        });
    };

    function ModalController($scope, $modalInstance) {
        $scope.user = {};

        $scope.ok = function () {
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.signin = function () {
            Users.signin($scope.user)
                .success(function () {
                    window.location.href = '/';
                })
                .error(function (err) {
                    $log.warn(err);
                    $scope.hasServerError = true;
                });
        };
    }
}]);