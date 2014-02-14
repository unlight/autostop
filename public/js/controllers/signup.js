'use strict';

angular.module('autostop.users').controller('SignupController', [ '$scope', '$log', '$modal', 'Users', function ($scope, $log, $modal, Users) {
    $scope.user ={};

    $scope.open = function () {
        $modal.open({
            templateUrl: 'views/users/signup.html',
            controller: ModalController,
            resolve: {
                defaults: function () {
                    return $scope.user;
                }
            }
        });
    };

    function ModalController($scope, $modalInstance, defaults) {
        $scope.user = defaults;

        $scope.ok = function () {
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.signup = function (form) {
            var user = new Users($scope.user);
            user.username = user.email;

            user.$save(function () {
                    window.location.href = '/';
                },
                function (err) {
                    form.email.$setViewValue(form.name.$viewValue);
                    form.email.$setValidity('unique', false);
                });
        };

        //TODO: move to directive
        $scope.resetUnique = function (email) {
            email.$setValidity('unique', true);
        };
    }
}]);