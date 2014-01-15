'use strict';

angular.module('autostop.system').controller('IndexController', ['$scope', 'Global', function ($scope, Global) {
    $scope.global = Global;
}]);