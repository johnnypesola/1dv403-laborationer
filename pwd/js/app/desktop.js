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
                _appIsBeingDragged,
                _appIsBeingResized,
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
                        if (obj !== null && typeof obj === "object") {
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

                        if (obj !== null && typeof obj === "object") {
                            _lastAppStartPos = obj;
                        } else {
                            throw new Error("Desktops 'lastAppStartPos' property must be an object, i.e. {x: 20, y: 20}");
                        }
                    }
                },
                "appIsBeingDragged": {
                    get: function () { return _appIsBeingDragged; },
                    set: function (value) {
                        if (typeof value !== "boolean") {
                            throw new Error("Desktops 'appIsBeingDragged' property must be a boolean type.");
                        }

                        // Set value
                        _appIsBeingDragged = value;

                        // Add or remove CSS class on containerElement and change cursor
                        if (value) {
                            this.contentElement.classList.add("app-is-being-dragged");
                        } else {
                            this.contentElement.classList.remove("app-is-being-dragged");
                        }

                    }
                },
                "appIsBeingResized": {
                    get: function () { return _appIsBeingResized; },
                    set: function (value) {
                        if (typeof value !== "boolean") {
                            throw new Error("Desktops 'appIsBeingResized' property must be a boolean type.");
                        }

                        // Set value
                        _appIsBeingResized = value;

                        // Add or remove CSS class on containerElement and change cursor
                        if (value) {
                            this.contentElement.classList.add("app-is-being-resized");
                        } else {
                            this.contentElement.classList.remove("app-is-being-resized");
                        }

                    }
                }
            });


            // Init variables
            this.startMenu = {};
            this.contentElement = contentElement || document.body;

            this.addDropEventListener();

        };

        Constructor.prototype = {
            constructor: Constructor,

            // Render app
            startApp: function (appName, width, height) {

                var appStartPos,
                    zIndex,
                    newApp;

                // Figure out Zindex from array.
                zIndex = this.runningApps.length + 2;

                // Get app startposition
                appStartPos = this.getNextAppStartPos(width, height);

                // Start App
                newApp = new AppContainer(this, appName, this.generateUID(), appStartPos.x, appStartPos.y, (width || 200), (height || 200), zIndex)

                newApp.render("This is the content for now. Yeah it is. This is the content for now. Yeah it is. This is the content for now. Yeah it is. This is the content for now. Yeah it is. This is the content for now. Yeah it is. ");

                // Add new appa to array with running apps
                this.runningApps.push(newApp);

                // Set new lastAppStartPos
                this.lastAppStartPos = appStartPos;
            },

            getNextAppStartPos: function (width, height) {
                var x = this.lastAppStartPos.x += 20,
                    y = this.lastAppStartPos.y += 20;

                if (x + width > this.contentElement.offsetWidth) {
                    x = 20;
                }
                if (y + height > this.contentElement.offsetHeight) {
                    y = 20;
                }

                return  {x: x, y: y};
            },

            zIndexOrderApps: function () {
                var i
                for (i = 0; i < this.runningApps.length; i++) {
                    this.runningApps[i].zIndex = i+1;
                }
            },

            addDropEventListener: function () {
                var data,
                    x,
                    y,
                    targetAppObj,
                    that = this;

                this.contentElement.addEventListener("drop", function (e) {

                    console.log("dropped: " + e.dataTransfer.getData("text") );

                    // Get data from drag
                    data = e.dataTransfer.getData("text").split(',');


                    // Find out target App from received data.
                    targetAppObj = that.getAppByUID(data[0]);

                    if (!targetAppObj.isBeingDragged) {
                        return false;
                    }

                    // Parse cordinates
                    x = e.clientX + parseInt(data[1], 10);
                    y = e.clientY + parseInt(data[2], 10);

                    e.preventDefault();
                    that.isBeingDragged = false;

                    // Move app
                    that.moveApp(targetAppObj, x, y);

                    return false;
                });
            },

            focusApp: function (targetAppObj) {

                var i;

                // Move target app to last position in array.
                for (i = 0; i < this.runningApps.length; i++) {
                    if (this.runningApps[i].UID === targetAppObj.UID) {
                        this.runningApps.move(i, this.runningApps.length - 1);
                    }
                }

                // Update zIndexes
                for (i = 0; i < this.runningApps.length; i++) {
                    this.runningApps[i].zIndex = i;
                }
            },

            moveApp: function (targetAppObj, x, y) {

                // Focus targetApp, bring it o front.
                this.focusApp(targetAppObj);

                // Move appContainer to new location
                targetAppObj.moveTo(x, y);
            },

            closeApp: function (targetAppObj) {
                var i;

                // Search for app in array and remove it.
                for (i = 0; i < this.runningApps.length; i++) {
                    if (this.runningApps[i].UID === targetAppObj.UID) {
                        this.runningApps.splice(i, 1);
                        break;
                    }
                }
            },

            getAppByUID: function (targetUID) {
                var returnValue = false,
                    i;

                for (i = 0; i < this.runningApps.length; i++) {
                    if (this.runningApps[i].UID === targetUID) {
                        returnValue = this.runningApps[i];
                        break;
                    }
                }

                return returnValue;
            },

            generateUID: function () {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                    return v.toString(16);
                });
            }
        };

        return Constructor;

    }());
});