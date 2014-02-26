(function () {
    'use strict';

    var controllerName = 'RouteCreateController';

    describe(controllerName, function () {

        var $controller,
            $rootScope,
            $httpBackend,
            $q,
            Routes,
            route;

        beforeEach(module('autostop.routes'));
        beforeEach(inject(function (_$controller_, _$rootScope_, _$httpBackend_, _$q_, _Routes_) {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $httpBackend = _$httpBackend_;
            $q = _$q_;
            Routes = _Routes_;

            route = {
                origin: {
                    id: '1',
                    text: 'Origin location'
                },
                destination: {
                    id: '2',
                    text: 'Destination location'
                }
            };
        }));

        it('should be defined', function () {
            var controller = $controller(controllerName, {
                $scope: $rootScope.$new(),
                $modalInstance: {},
                Global: { user: {} }
            });

            expect(controller).toBeDefined();
        });

        it('should properly generate route\'s title', function () {
            //Arrange
            var scope = $rootScope.$new();
            $controller(controllerName, {
                $scope: scope,
                $modalInstance: {},
                Global: {}
            });
            scope.route = route;

            //Act
            var title = scope.title();

            //Assert
            expect(title).toEqual(Routes.title(route.origin.text, route.destination.text));
        });

        it('should be able to create route from predefined locations', function () {
            //Arrange
            var scope = $rootScope.$new();
            $controller(controllerName, {
                $scope: scope,
                $modalInstance: { close: jasmine.createSpy() },
                Global: { user: { _id: '1' } }
            });

            scope.route = {
                origin: { id: '3', text: 'Location A' },
                destination: { id: '4', text: 'Location B' }
            };

            //Act
            $httpBackend.expectPOST('/api/routes', {
                origin: scope.route.origin.id,
                destination: scope.route.destination.id,
                title: scope.route.origin.text + ' - ' + scope.route.destination.text
            }).respond();

            scope.ok();
            $httpBackend.flush();

            //Assert
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should be able to create route from new locations', function () {
            //Arrange
            var scope = $rootScope.$new();
            $controller(controllerName, {
                $scope: scope,
                $modalInstance: { close: jasmine.createSpy() },
                Global: { user: { _id: '1' } }
            });

            scope.route = {
                origin: { text: 'Location A' },
                destination: { text: 'Location B' }
            };

            //Act
            $httpBackend.expectPOST('/api/routes', {
                origin: { title: scope.route.origin.text },
                destination: { title: scope.route.destination.text },
                title: scope.route.origin.text + ' - ' + scope.route.destination.text
            }).respond();

            scope.ok();
            $httpBackend.flush();

            //Assert
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should wait until route is created and then close the modal', function () {
            //Arrange
            var scope = $rootScope.$new(),
                modalInstance = jasmine.createSpyObj('modal', ['close']),
                route = { _id: 1 };
            $controller(controllerName, {
                $scope: scope,
                $modalInstance: modalInstance,
                Global: {}
            });

            scope.route = {
                origin: { id: 1 },
                destination: { id: 2}
            };

            $httpBackend.whenPOST('/api/routes')
                .respond(route);

            //Act
            scope.ok();
            $httpBackend.flush();

            //Assert
            expect(modalInstance.close).toHaveBeenCalled();
            expect(modalInstance.close.mostRecentCall.args.length).toEqual(1);
            var routeResource = modalInstance.close.mostRecentCall.args[0];
            expect(routeResource._id).toEqual(route._id);
        });

        it('should dismiss modal on cancel', function () {
            //Arrange
            var scope = $rootScope.$new(),
                modalInstance = jasmine.createSpyObj('modal', ['dismiss']);
            $controller(controllerName, {
                $scope: scope,
                $modalInstance: modalInstance,
                Global: { user: {} }
            });

            //Act
            scope.cancel();

            //Assert
            expect(modalInstance.dismiss).toHaveBeenCalledWith('cancel');
        });
    });
})();