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
    'autostop.routes']);

angular.module('autostop.system', []);
angular.module('autostop.articles', []);
angular.module('autostop.users', []);
angular.module('autostop.routes', []);