(function () {
    'use strict';

    var controllerName = 'RouteEditController';

    describe(controllerName, function () {

        var $rootScope,
            $controller,
            $httpBackend,
            $q,
            Global,
            Routes,
            route;

        beforeEach(module('autostop.routes'));

        beforeEach(inject(function (_$rootScope_, _$controller_, _$httpBackend_, _$q_, _Routes_) {
            $rootScope = _$rootScope_;
            $controller = _$controller_;
            $httpBackend = _$httpBackend_;
            $q = _$q_;
            Routes = _Routes_;

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
                $scope: $rootScope.$new(),
                $modalInstance: {},
                route: route
            });

            expect(controller).toBeDefined();
        });

        it('should display passed route', function () {
            //Arrange
            var scope = $rootScope.$new();

            //Act
            $controller(controllerName, {
                $scope: scope,
                $modalInstance: {},
                route: route
            });

            //Assert
            expect(scope.route._id).toEqual(route._id);
            expect(scope.route.origin.id).toEqual(route.origin._id);
            expect(scope.route.origin.text).toEqual(route.origin.title);
            expect(scope.route.destination.id).toEqual(route.destination._id);
            expect(scope.route.destination.text).toEqual(route.destination.title);
        });

        it('should properly display route\'s title', function () {
            //Arrange
            var scope = $rootScope.$new();
            $controller(controllerName, {
                $scope: scope,
                $modalInstance: {},
                route: route
            });

            //Act
            var title = scope.title();

            //Assert
            expect(title).toEqual(Routes.title(route.origin.title, route.destination.title));
        });

        it('should dismiss modal on cancel', function () {
            //Arrange
            var scope = $rootScope.$new(),
                modalInstance = jasmine.createSpyObj('modal', ['dismiss']);
            $controller(controllerName, {
                $scope: scope,
                $modalInstance: modalInstance,
                route: route
            });

            //Act
            scope.cancel();

            //Assert
            expect(modalInstance.dismiss).toHaveBeenCalledWith('cancel');
        });

        it('should close modal on save', function () {
            //Arrange
            var scope = $rootScope.$new(),
                modalInstance = jasmine.createSpyObj('modal', ['close']);
            $controller(controllerName, {
                $scope: scope,
                $modalInstance: modalInstance,
                route: route
            });
            $httpBackend.whenPUT('/api/routes/' + route._id)
                .respond(route);

            //Act
            scope.ok();
            $httpBackend.flush();

            //Assert
            expect(modalInstance.close).toHaveBeenCalled();
            var routeResource = modalInstance.close.mostRecentCall.args[0];
            expect(routeResource._id).toEqual(route._id);
        });

        it('should update route using predefined locations', function () {
            //Arrange
            var scope = $rootScope.$new();
            $controller(controllerName, {
                $scope: scope,
                $modalInstance: jasmine.createSpyObj('modal', ['close']),
                route: route
            });

            //Act
            scope.ok();

            //Assert
            $httpBackend.expectPUT('/api/routes/' + route._id, {
                title: route.origin.title + ' - ' + route.destination.title,
                origin: route.origin._id,
                destination: route.destination._id
            }).respond();
            $httpBackend.flush();
        });

        it('should update route using new locations', function () {
            //Arrange
            var scope = $rootScope.$new();
            $controller(controllerName, {
                $scope: scope,
                $modalInstance: jasmine.createSpyObj('modal', ['close']),
                route: route
            });
            scope.route.origin.id = null;
            scope.route.destination.id = null;

            //Act
            scope.ok();

            //Assert
            $httpBackend.expectPUT('/api/routes/' + route._id, {
                title: route.origin.title + ' - ' + route.destination.title,
                origin: { title: route.origin.title },
                destination: { title: route.destination.title }
            }).respond();
            $httpBackend.flush();
        });
    });
})();