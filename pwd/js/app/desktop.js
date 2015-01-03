/**
 * Created by Johnny on 2015-01-03.
 */

"use strict";

define(["mustache", "app/appcontainer", "app/extensions"], function(Mustache, AppContainer) {

    return (function () {

        var Constructor = function (contentElement) {

            var _runningApps = [],
                _startMenu,
                _contentElement,
                _lastAppStartPos = {x: 20, y: 20};

            // Properties with Getters and Setters
            Object.defineProperties(this, {
                "runningApps": {
                    get: function () {
                        return _runningApps || "";
                    }
                },
                "startMenu": {
                    get: function () {
                        return _startMenu || "";
                    },
                    set: function (obj) {
                        if (obj !== null && typeof obj === "Object") {
                            _startMenu = obj;
                        } else {
                            throw new Error("Desktops 'startMenu' property must be an object");
                        }
                    }
                },
                "contentElement": {
                    get: function () { return _contentElement || ""; },

                    set: function (element) {
                        if (element !== null && element.nodeName !== "undefined") {
                            _contentElement = element;
                        } else {
                            throw new Error("Desktops 'contentElement' property must be an element");
                        }
                    }
                },
                "lastAppStartPos": {
                    get: function () { return _lastAppStartPos || ""; },

                    set: function (obj) {

                        if (obj !== null && typeof obj === "Object") {
                            _lastAppStartPos = obj;
                        } else {
                            throw new Error("Desktops 'lastAppStartPos' property must be an object, i.e. {x: 20, y: 20}");
                        }
                    }
                }
            });


            // Init variables
            this.startMenu = {};
            this.contentElement = contentElement || document.body;

        };

        Constructor.prototype = {
            constructor: Constructor,

            // Render app
            startApp: function (appName, width, height) {

                var x,
                    y,
                    zIndex;

                // Figure out Zindex from array.
                zIndex = this.runningApps.length + 2;

                // Figure out x and y from array.

                this.runningApps.push(new AppContainer(this, this.generateUID(), x, y, (width || 200), (height || 200), zIndex));
            },

            nextAppStartPos: function(width, height) {
                if(this.lastAppStartPos + width > this.containerElement.width)
            },

            moveApp: function(appContainer) {

            },

            zIndexOrderApps: function () {
                var i
                for (i = 0; i < this.runningApps.length; i++) {
                    this.runningApps[i].zIndex = i+1;
                }
            },

            generateUID: function () {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                    return v.toString(16);
                });
            }
        };
    }());
});