'use strict';

angular.module('autostop.users').controller('SignupController', [ '$scope', '$log', '$modal', 'Users', function ($scope, $log, $modal, Users) {
    $scope.open = function () {
        $modal.open({
            templateUrl: 'views/users/signup.html',
            controller: ModalController,
            resolve: {
                defaults: function () {
                    return {
                        name: 'Ivan Ivanov',
                        email: 'ivan.ivanov@mail.com',
                        phone: '+7 123 456 7890',
                        password: '1234'
                    };
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

            $log.info('Save user');
            $log.info(user);

            user.$save(function () {
                    $log.info(' User created');
                },
                function (err) {
                    $log.warn(err.data);
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