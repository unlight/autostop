'use strict';

angular.module('autostop.system').service('Calendar', function () {

    /**
     * Returns today's midnight date.
     * @returns {Date}
     */
    this.today = function (now) {
        now = now || new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    };

    /**
     * Returns tomorrow's midnight date.
     * @returns {Date}
     */
    this.tomorrow = function (now) {
        now = now || new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
    };

    /**
     * Returns next even hour of specified moment.
     * For example, returns 10:00 for 9:45 input.
     * @param now
     * @returns {Date}
     */
    this.nextHour = function (now) {
        now = now || new Date();
        console.log(now);
        return new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 0);
    };

    /**
     * Returns new datetime created by combining date and time of arguments.
     * @param date
     * @param time
     */
    this.combineDates = function (date, time) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes(), time.getSeconds());
    };
});