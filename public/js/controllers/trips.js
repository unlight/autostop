(function () {
    'use strict';

    angular.module('autostop.trips').controller('TripsController',
        [ '$scope', '$rootScope', '$modal', 'Global', 'Calendar', 'Trips',
            function ($scope, $rootScope, $modal, Global, Calendar, Trips) {
                $scope.trips = Trips.query({
                    creator: Global.user._id
                });
				
				var tomorrow = new Date();
				tomorrow.setDate(tomorrow.getDate()+1);

				$scope.closest = Trips.query({
					startMin: new Date(),
					startMax: tomorrow
				});
				
				$scope.isJoined = function(trip){
					for(var i=0;i<trip.passengers.length;i++){
						if(trip.passengers[i] === Global.user._id){
							return true;
						}
					}
					return false;
				};
				
				$scope.isDriver = function(trip){
					return trip.creator._id === Global.user._id;
				};
				
				$scope.join = function(trip){
					Trips.join(trip, addToPassengers);
				};
				
				function addToPassengers(trip){
					trip.passengers.push(Global.user._id);
				}
				
				function removeFromPassengers(trip){
					trip.passengers.splice(trip.passengers.indexOf(Global.user._id), 1);
				}
				
				$scope.leave = function(trip){
					Trips.leave(trip, removeFromPassengers);
				};
				
                $rootScope.$on('trip-create-request', function (ev, data) {
                    $scope.create(data.route);
                });

                $scope.create = function (route) {
                    var modal = $modal.open({
                        templateUrl: 'views/trips/item.html',
                        controller: CreateTripModalController,
                        resolve: {
                            route: function () {
                                return route;
                            }
                        }
                    });

                    modal.result.then(function (trip) {
                        $scope.trips.splice(0, 0, trip);
                        $scope.trips.splice();
                    });
                };

                $scope.edit = function (trip) {
                    var modal = $modal.open({
                        templateUrl: 'views/trips/item.html',
                        controller: EditTripModalController,
                        resolve: {
                            trip: function () {
                                return trip;
                            }
                        }
                    });

                    modal.result.then(function (updatedTrip) {
                        var index = $scope.trips.indexOf(trip);
                        $scope.trips.splice(index, 1, updatedTrip);
                    });
                };

                $scope.cancel = function (trip) {
                    var modal = $modal.open({
                        templateUrl: 'views/trips/cancel.html',
                        controller: CancelTripModalController,
                        resolve: {
                            trip: function () {
                                return trip;
                            }
                        }
                    });

                    modal.result.then(function () {
                        var index = $scope.trips.indexOf(trip);
                        $scope.trips.splice(index, 1);
                    });
                };

                function CreateTripModalController($scope, $modalInstance, route) {
                    $scope.route = route;
                    $scope.trip = {
                        route: route._id,
                        start: Calendar.nextHour(),
                        seats: 3,
                        note: ''
                    };

                    $scope.today = function () {
                        $scope.trip.start = Calendar.combineDates(Calendar.today(), $scope.trip.start);
                    };

                    $scope.tomorrow = function () {
                        $scope.trip.start = Calendar.combineDates(Calendar.tomorrow(), $scope.trip.start);
                    };

                    $scope.ok = function () {
                        var trip = new Trips($scope.trip);
                        trip.$save(function (trip) {
                            $modalInstance.close(trip);
                        });
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                }

                function EditTripModalController($scope, $modalInstance, trip) {
                    $scope.trip = _.extend(trip, {
                        start: new Date(trip.start)
                    });

                    $scope.route = trip.route;

                    $scope.today = function () {
                        $scope.trip.start = Calendar.combineDates(Calendar.today(), $scope.trip.start);
                    };

                    $scope.tomorrow = function () {
                        $scope.trip.start = Calendar.combineDates(Calendar.tomorrow(), $scope.trip.start);
                    };

                    $scope.ok = function () {
                        var trip = new Trips({
                            start: $scope.trip.start,
                            seats: $scope.trip.seats,
                            note: $scope.trip.note
                        });

                        trip.$update({ tripId: $scope.trip._id }, function (trip) {
                            $modalInstance.close(trip);
                        });
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                }

                function CancelTripModalController($scope, $modalInstance, trip) {
                    $scope.trip = trip;

                    $scope.ok = function () {
                        trip.$delete(function () {
                            $modalInstance.close();
                        });
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                }
            }]);
})();