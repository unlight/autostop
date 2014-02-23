(function () {
    'use strict';

    var controllerName = 'RouteDeleteController';

    describe(controllerName, function () {

        var $rootScope,
            $controller,
            $httpBackend,
            $q,
            Global,
            route;

        beforeEach(module('autostop.routes'));

        beforeEach(inject(function (_$rootScope_, _$controller_, _$httpBackend_, _$q_, Routes) {
            $rootScope = _$rootScope_;
            $controller = _$controller_;
            $httpBackend = _$httpBackend_;
            $q = _$q_;

            Global = {
                user: {
                    _id: '1',
                    name: 'First Last'
                }
            };

            route = new Routes({
                _id: '1',
                title: 'Route title',
                origin: {
                    _id: '2',
                    title: 'Origin location'
                },
                destination: {
                    _id: '3',
                    title: 'Destination location'
                }
            });
        }));

        it('should be defined', function () {
            var controller = $controller(controllerName, {
                scope: $rootScope.$new(),
                modalInstance: {},
                route: route
            });

            expect(controller).toBeDefined();
        });

        it('should display passed route', function () {
            //Arrange
            var scope = $rootScope.$new();

            //Act
            $controller(controllerName, {
                scope: scope,
                modalInstance: {},
                route: route
            });

            //Assert
            expect(scope.route._id).toEqual(route._id);
            expect(scope.route.origin.title).toEqual(route.origin.title);
            expect(scope.route.destination.title).toEqual(route.destination.title);
        });

        it('should dismiss modal on cancel', function () {
            //Arrange
            var scope = $rootScope.$new(),
                modalInstance = jasmine.createSpyObj('modal', ['dismiss']);
            $controller(controllerName, {
                scope: scope,
                modalInstance: modalInstance,
                route: route
            });

            //Act
            scope.cancel();

            //Assert
            expect(modalInstance.dismiss).toHaveBeenCalledWith('cancel');
        });

        it('should close modal on delete', function () {
            //Arrange
            var scope = $rootScope.$new(),
                modalInstance = jasmine.createSpyObj('modal', ['close']);
            $controller(controllerName, {
                scope: scope,
                modalInstance: modalInstance,
                route: route
            });
            $httpBackend.whenDELETE('/api/routes/' + route._id)
                .respond();

            //Act
            scope.ok();
            $httpBackend.flush();

            //Assert
            expect(modalInstance.close).toHaveBeenCalled();
        });

        it('should delete route', function () {
            //Arrange
            var scope = $rootScope.$new();
            $controller(controllerName, {
                scope: scope,
                modalInstance: jasmine.createSpyObj('modal', ['close']),
                route: route
            });

            //Act
            scope.ok();

            //Assert
            $httpBackend.expectDELETE('/api/routes/' + route._id)
                .respond();
            $httpBackend.flush();
        });
    });
})();