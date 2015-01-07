"use strict"


define(["mustache", "app/extensions"], function (Mustache) {

    return (function () {

        var MemoryCard = function (number) {
            var _cardNum,
                _isCardOpen,
                _isMatchFound;

            // Properties with getters and Setters
            Object.defineProperties(this, {
                "cardNum": {
                    get: function () { return _cardNum; },
                    set: function (value) {
                        var parsedValue = parseFloat(value);
                        if (!(!isNaN(parsedValue) && isFinite(parsedValue) && parsedValue % 1 === 0 && value === parsedValue)) {
                            throw new Error("MemoryBoards 'cardNum' property must be an int type.");
                        }

                        _cardNum = value;
                    }
                },
                "isCardOpen": {
                    get: function () { return _isCardOpen; },
                    set: function (value) {
                        if (typeof value !== "boolean") {
                            throw new Error("MemoryBoards 'isCardOpen' property must be a boolean type.");
                        }

                        _isCardOpen = value;
                    }
                },
                "isMatchFound": {
                    get: function () { return _isMatchFound; },
                    set: function (value) {
                        if (typeof value !== "boolean") {
                            throw new Error("MemoryBoards 'isMatchFound' property must be a boolean type.");
                        }

                        _isMatchFound = value;
                    }
                }
            });

            // Assign constructors default values to properties
            this.cardNum = number || 0;
            this.isCardOpen = false;
            this.isMatchFound = false;
        };

    /* Prototype */
        MemoryCard.prototype = {
            constructor:    MemoryCard,

            titleArray: [
                "Simon the sorcerer",
                "Cannon fodder",
                "Flashback",
                "It Came From The Desert",
                "Pirates!",
                "Stunt Racer",
                "Beneath A Steel Sky",
                "Leisure suit Larry 3"
            ],

            getCssClass: function () {
                return this.titleArray[this.cardNum].replace(/\s+/g, '-').toLowerCase().replace(/[^0-9a-zåäö\-]/g, '');
            },

            getTitle: function () {
                return this.titleArray[this.cardNum];
            },

            isEqualTo: function (obj) {
                if (obj instanceof MemoryCard && obj.cardNum === this.cardNum) {
                    return true;
                }
                return false;
            }

        };

        return MemoryCard;

    }());

});