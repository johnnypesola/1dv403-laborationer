"use strict";


define(["mustache", "app/extensions"], function (Mustache) {

    return (function () {

        var Message = function(message, date){
            var _date,
                _message;

            // Properties with getters and Setters
            Object.defineProperties(this, {
                "text": {
                    get: function () { return this._message || ""; },
                    set: function (value) { this._message = value; }
                },
                "date": {
                    get: function () { return this._date || ""; },
                    set: function (value) {
                        if (!(value instanceof Date)) {
                            throw new Error("ERROR: the date property can only contain a date object");
                        }
                        this._date = value;
                    }
                }
            });

            // Assign constructors default values to properties
            this.date = date || new Date();
            this.text = message || "";
        };

    /* Prototype methods, replace prototype with custom object with methods */
        Message.prototype = {
            constructor: Message, // Reestablish constructor pointer

            toString: function () {
                return this.text + " (" + this.date + ")";
            },

            getHTMLText: function () {
                return this.text.replace(/\n/g, "<br>");
            }
        };

        return Message;

    }());

});