(function () {
    'use strict';

    var controllerName = 'RouteListController';

    describe(controllerName, function () {
        var $controller,
            $rootScope,
            $httpBackend,
            $q,
            GlobalMock;

        beforeEach(module('autostop.routes'));

        beforeEach(inject(function (_$controller_, _$rootScope_, _$httpBackend_, _$q_) {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $httpBackend = _$httpBackend_;
            $q = _$q_;

            GlobalMock = {
                user: { _id: 1 }
            };
        }));

        it('should be defined', function () {
            //Arrange
            var $scope = $rootScope.$new(),
                RouteListController = $controller('RouteListController', {
                    $scope: $scope,
                    Global: { user: { _id: '1', name: 'Pavel'}}
                });

            //Assert
            expect(RouteListController).toBeDefined();
        });

        describe('List', function () {
            var $scope,
                RouteListController;

            beforeEach(function () {
                $scope = $rootScope.$new();

                RouteListController = $controller('RouteListController', {
                    $scope: $scope,
                    Global: { user: { _id: '1', name: 'Pavel'}}
                });
            });

            it('should be populated on load for current user', function () {
                //Arrange
                $httpBackend.whenGET('/api/routes?creator=1')
                    .respond([
                        { _id: '1', title: 'Route title' }
                    ]);

                //Act
                $httpBackend.flush();

                //Assert
                expect($scope.routes.length).toEqual(1);
            });

            afterEach(function () {
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            });
        });

        describe('Create', function () {
            var $modalMock,
                $scope,
                defer;

            beforeEach(inject(function ($q) {
                defer = $q.defer();
                $modalMock = jasmine.createSpyObj('$modal', ['open']);
                $modalMock.open.andReturn({
                    result: defer.promise
                });
                $scope = $rootScope.$new();
            }));

            it('should be able to open', function () {
                //Arrange
                $controller('RouteListController', {
                    $scope: $scope,
                    $modal: $modalMock,
                    Global: { user: { _id: '1', name: 'Pavel'}}
                });

                //Act
                $scope.create();

                //Assert
                expect($modalMock.open).toHaveBeenCalled();
                var args = $modalMock.open.mostRecentCall.args;
                expect(args.length).toEqual(1);
                var modalOptions = args[0];
                console.log(modalOptions.controller);
                expect(modalOptions.controller).toEqual('RouteCreateController');
                expect(modalOptions.templateUrl).toEqual('views/routes/item.html');
            });

            it('should pass created route back to scope', function () {
                //Arrange
                $controller('RouteListController', {
                    $scope: $scope,
                    $modal: $modalMock,
                    Global: { user: { _id: '1', name: 'Pavel'}}
                });
                var route = {
                    _id: 1,
                    title: 'Route title'
                };
                $httpBackend.whenGET('/api/routes?creator=1')
                    .respond([]);

                //Act
                $httpBackend.flush();
                $scope.create();
                defer.resolve(route);
                $scope.$digest();

                //Assert
                expect($scope.routes.length).toEqual(1);
                expect($scope.routes[0]).toBe(route);
            });
        });

        describe('Delete', function () {
            it('should open confirmation modal', function () {
                //Arrange
                var scope = $rootScope.$new(),
                    modalMock = jasmine.createSpyObj('$modal', ['open']),
                    route = { _id: 1 };
                modalMock.open.andReturn({
                    result: $q.defer().promise
                });
                $controller(controllerName, {
                    $scope: scope,
                    $modal: modalMock,
                    Global: GlobalMock
                });

                //Act
                scope.delete(route);

                //Assert
                expect(modalMock.open).toHaveBeenCalled();
                var modalOptions = modalMock.open.mostRecentCall.args[0];
                expect(modalOptions.controller).toEqual('RouteDeleteController');
                expect(modalOptions.templateUrl).toEqual('views/routes/delete.html');
            });

            it('should not show deleted route', function () {
                //Arrange
                var scope = $rootScope.$new(),
                    modalMock = jasmine.createSpyObj('$modal', ['open']),
                    defer = $q.defer(),
                    route = { _id: 1 };
                modalMock.open.andReturn({
                    result: defer.promise
                });
                $httpBackend.whenGET('/api/routes?creator=' + GlobalMock.user._id)
                    .respond([ route ]);

                $controller(controllerName, {
                    $scope: scope,
                    $modal: modalMock,
                    Global: GlobalMock
                });

                //Act
                $httpBackend.flush();
                scope.delete(route);
                defer.resolve();
                scope.$digest();

                //Assert
                expect(scope.routes.length).toEqual(0);
            });
        });
    });
})();