'use strict';

angular.module('autostop', [
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ui.bootstrap',
    'ui.route',
    'autostop.system',
    'autostop.articles',
    'autostop.users',
    'autostop.routes',
    'autostop.locations'
]);

angular.module('autostop.system', []);
angular.module('autostop.articles', []);
angular.module('autostop.users', []);
angular.module('autostop.routes', []);
angular.module('autostop.locations', []);