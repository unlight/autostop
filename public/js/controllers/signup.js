'use strict';

angular.module('autostop.users').controller('SignupController', [ '$scope', '$log', '$modal', 'Users', function ($scope, $log, $modal, Users) {
//    $scope.name = 'Ivan Ivanov';
//    $scope.email = 'ivan.ivanov@mail.com';
//    $scope.phone = '+7 123 456 7890'
//    $scope.password = '1234';

    $scope.open = function () {
        $modal.open({
            templateUrl: 'views/users/signup.html',
            controller: ModalController,
            resolve: {
                defaults: function () {
                    return {
                        name: $scope.name,
                        email: $scope.email,
                        phone: $scope.phone,
                        password: $scope.password
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

        $scope.signup = function () {
            var user = new Users($scope.user);
            user.username = user.email;

            $log.info('Save user');
            $log.info(user);

            user.$save(function () {
                $log.info(' User created');
            });
        };
    }
}]);