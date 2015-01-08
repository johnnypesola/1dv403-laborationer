"use strict";

(function () {

    // Add a better isInt method for Number
    Number.prototype.isInt = function () {

        var parsedVal = parseFloat(this.valueOf());

        return !isNaN(parsedVal) && isFinite(parsedVal) && parsedVal % 1 === 0 && this.valueOf() == parsedVal;
    };

    // Add move method for Array.
    Array.prototype.move = function (old_index, new_index) {
        if (new_index >= this.length) {
            var k = new_index - this.length;
            while ((k--) + 1) {
                this.push(undefined);
            }
        }
        this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    };

    // Copy Array.forEach to NodeList.forEach
    NodeList.prototype.forEach = Array.prototype.forEach;

    // Extended method for Date.
    Date.prototype.getHoursMinutesSeconds = function () {
        var hours = ('0' + this.getHours()).slice(-2),
            minutes = ('0' + this.getMinutes()).slice(-2),
            seconds = ('0' + this.getSeconds()).slice(-2);

        return hours + ":" + minutes + ":" + seconds;
    };

    Date.prototype.getYearsMonthsDays = function () {
        var years = this.getFullYear(),
            months = ('0' + (this.getMonth() + 1)).slice(-2),
            days = ('0' + this.getDate()).slice(-2);

        return years + "-" + months + "-" + days;
    };

}());