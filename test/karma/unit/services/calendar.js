'use strict';

describe('Calendar service', function () {
    var Calendar;

    beforeEach(function () {
        module('autostop.system');
        inject(function (_Calendar_) {
            Calendar = _Calendar_;
        });
    });

    it('should be defined', function () {
        expect(Calendar).toBeDefined();
    });

    describe('nextHour method', function () {
        it('should return next even hour', function () {
            var date = new Date(2014, 1, 1, 11, 45, 0);
            var nextHour = Calendar.nextHour(date);
            expect(nextHour).toEqual(new Date(2014, 1, 1, 12, 0, 0));
        });

        it('should return next even hour for day boundary', function () {
            var date = new Date(2014, 1, 1, 23, 45, 0);
            var nextHour = Calendar.nextHour(date);
            expect(nextHour).toEqual(new Date(2014, 1, 2, 0, 0, 0));
        });
    });

    describe('combineDates method', function () {
        it('should combine date and time of arguments', function () {
            var date = new Date(2010, 10, 10, 0, 0, 0);
            var time = new Date(2000, 1, 1, 23, 45, 15);
            var combination = Calendar.combineDates(date, time);
            expect(combination).toEqual(new Date(2010, 10, 10, 23, 45, 15));
        });
    });

    describe('today method', function () {
        it('should return midnight time of specified date', function () {
            var date = new Date(2000, 1, 1, 23, 45, 15);
            var today = Calendar.today(date);
            expect(today).toEqual(new Date(2000, 1, 1, 0, 0, 0));
        });
    });

    describe('tomorrow method', function () {
        it('should return tomorrow\'s midnight time of specified date', function () {
            var date = new Date(2000, 1, 1, 23, 45, 15);
            var today = Calendar.tomorrow(date);
            expect(today).toEqual(new Date(2000, 1, 2, 0, 0, 0));
        });

        it('should return tomorrow\'s midnight time of specified date on month boundary', function () {
            var date = new Date(2000, 0, 31, 23, 45, 15);
            var today = Calendar.tomorrow(date);
            expect(today).toEqual(new Date(2000, 1, 1, 0, 0, 0));
        });
    });
});