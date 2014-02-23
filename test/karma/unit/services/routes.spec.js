(function () {
    'use strict';

    describe('Routes service', function () {

        var Routes,
            route;

        beforeEach(module('autostop.routes'));

        beforeEach(inject(function (_Routes_) {
            Routes = _Routes_;
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
            //Assert
            expect(Routes).toBeDefined();
        });

        describe('default title', function () {
            it('should contain origin and destination if defined', function () {
                //Act
                var title = Routes.title(route.origin.title, route.destination.title);

                //Assert
                expect(title).toEqual(route.origin.title + ' - ' + route.destination.title);
            });

            it('should contain only origin if destination is not defined', function () {
                //Arrange
                route.destination = null;

                //Act
                var title = Routes.title(route.origin.title, null);

                //Assert
                expect(title).toEqual(route.origin.title);
            });

            it('should contain only destination if origin is not defined', function () {
                //Arrange
                route.origin = null;

                //Act
                var title = Routes.title(null, route.destination.title);

                //Assert
                expect(title).toEqual(route.destination.title);
            });
        });
    });
})();