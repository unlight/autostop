'use strict';

describe('RoutesController', function () {
    var scope,
        RoutesController;

    beforeEach(module('autostop.routes'));

    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        RoutesController = $controller('RoutesController', {
            $scope: scope,
            Global: { user: { _id: '1', name: 'Pavel'}}
        });
    }));

    it('should be defined', function () {
        expect(RoutesController).toBeDefined();
    });

    describe('routes list', function () {
        var $httpBackend;

        beforeEach(inject(function (_$httpBackend_) {
            $httpBackend = _$httpBackend_;
            $httpBackend.whenGET('/api/routes?creator=1')
                .respond([{ _id: '1', title: 'Route title' }]);
        }));

        it('should populate routes on load for current user', function () {
            $httpBackend.flush();
            expect(scope.routes.length).toEqual(1);
        });

        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });
    });
});