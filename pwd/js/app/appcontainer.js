/**
 * Created by Johnny on 2015-01-03.
 */

"use strict";

define(["mustache", "app/extensions"], function (Mustache) {

    return (function () {

        var Constructor = function (desktopObj, appName, UID, x, y, width, height, zIndex) {

            var _desktopObj,
                _appName,
                _UID,
                _x,
                _y,
                _width,
                _height,
                _zIndex,
                _minifyButton,
                _closeButton,
                _containerElement,
                _runningApp,
                _headerElement,
                _contentElement,
                _isBeingDragged = false;

        // Properties with Getters and Setters
            Object.defineProperties(this, {
                "desktopObj": {
                    get: function () { return _desktopObj || ""; },

                    set: function (obj) {
                        if (obj !== null && typeof obj === "object") {
                            _desktopObj = obj;
                        } else {
                            throw new Error("AppContainers 'desktopObj' property must be an object");
                        }
                    }
                },
                "appName": {
                    get: function () { return _appName || ""; },

                    set: function (value) {
                        if (value !== null && typeof value === "string") {
                            _appName = value;
                        } else {
                            throw new Error("AppContainers 'appName' property must be a string.");
                        }
                    }
                },
                "UID": {
                    get: function () { return _UID || ""; },

                    set: function (value) {
                        if (this.UID !== "") {
                            throw new Error("AppContainers 'UID' is already set)");
                        }
                        if (value.match(/[0-9a-zA-Z]{8}\-[0-9a-zA-Z]{4}\-[0-9a-zA-Z]{4}\-[0-9a-zA-Z]{4}\-[0-9a-zA-Z]{12}/) === null) {
                            throw new Error("AppContainers 'UID' property must be an valid UID. (xxxxxxxx-xxxx-4xxx-xxxx-xxxxxxxxxxxx)");
                        }

                        _UID = value;
                    }
                },
                "x": {
                    get: function () { return _x || ""; },

                    set: function (value) {
                        var parsedValue = parseFloat(value);
                        if (parsedValue.isInt() && parsedValue >= 0) {

                            _x = parsedValue;

                            // Apply this value if this app is rendered
                            if (this.isRendered) {
                                this.containerElement.style.left = parsedValue + "px";
                            }

                        } else {
                            throw new Error("AppContainers 'x' property must be an int.");
                        }
                    }
                },
                "y": {
                    get: function () { return _y || ""; },

                    set: function (value) {
                        var parsedValue = parseFloat(value);
                        if (parsedValue.isInt() && parsedValue >= 0) {
                            _y = parsedValue;

                            // Apply this value if this app is rendered
                            if (this.isRendered) {
                                this.containerElement.style.top = parsedValue + "px";
                            }

                        } else {
                            throw new Error("AppContainers 'y' property must be an int.");
                        }
                    }
                },
                "width": {
                    get: function () { return _width || ""; },

                    set: function (value) {
                        var parsedValue = parseFloat(value);
                        if (parsedValue.isInt() && parsedValue >= 0) {

                            _width = parsedValue;

                            // Apply this width if this app is rendered
                            if (this.isRendered) {
                                this.containerElement.style.width = parsedValue + "px";
                            }

                        } else {
                            throw new Error("AppContainers 'width' property must be an int.");
                        }
                    }
                },
                "height": {
                    get: function () { return _height || ""; },

                    set: function (value) {
                        var parsedValue = parseFloat(value);
                        if (parsedValue.isInt() && parsedValue >= 0) {
                            _height = parsedValue;

                            // Apply this height if this app is rendered
                            if (this.isRendered) {
                                this.contentElement.style.height = parsedValue + "px";
                            }

                        } else {
                            throw new Error("AppContainers 'height' property must be an int.");
                        }
                    }
                },
                "zIndex": {
                    get: function () { return _zIndex || ""; },

                    set: function (value) {
                        var parsedValue = parseFloat(value);
                        if (parsedValue.isInt() && parsedValue >= 0) {

                            _zIndex = parsedValue;

                            // Apply this zIndex if this app is rendered
                            if (this.isRendered) {
                                this.containerElement.style.zIndex = parsedValue;
                            }

                        } else {
                            throw new Error("AppContainers 'zIndex' property must be an int.");
                        }
                    }
                },
                "closeButton": {
                    get: function () { return _closeButton || ""; },

                    set: function (element) {
                        if (element !== null && element.nodeName !== "undefined") {
                            _closeButton = element;
                        } else {
                            throw new Error("AppContainers 'closeButton' property must be an element");
                        }
                    }
                },
                "minifyButton": {
                    get: function () { return _minifyButton || ""; },

                    set: function (element) {
                        if (element !== null && element.nodeName !== "undefined") {
                            _minifyButton = element;
                        } else {
                            throw new Error("AppContainers 'minifyButton' property must be an element");
                        }
                    }
                },
                "headerElement": {
                    get: function () { return _headerElement || ""; },

                    set: function (element) {
                        if (element !== null && element.nodeName !== "undefined") {
                            _headerElement = element;
                        } else {
                            throw new Error("AppContainers 'headerElement' property must be an element");
                        }
                    }
                },
                "contentElement": {
                    get: function () { return _contentElement || ""; },

                    set: function (element) {
                        if (element !== null && element.nodeName !== "undefined") {
                            _contentElement = element;
                        } else {
                            throw new Error("AppContainers 'contentElement' property must be an element");
                        }
                    }
                },
                "containerElement": {
                    get: function () { return _containerElement || ""; },

                    set: function (element) {
                        if (element !== null && element.nodeName !== "undefined") {
                            _containerElement = element;
                        } else {
                            throw new Error("AppContainers 'containerElement' property must be an element");
                        }
                    }
                },
                "runningApp": {
                    get: function () { return _runningApp || ""; },

                    set: function (obj) {
                        if (obj !== null && typeof obj === "Object") {
                            _runningApp = obj;
                        } else {
                            throw new Error("AppContainers 'runningApp' property must be an object");
                        }
                    }
                },
                "isBeingDragged": {
                    get: function () { return _isBeingDragged; },
                    set: function (value) {
                        if (typeof value !== "boolean") {
                            throw new Error("AppContainers 'isBeingDragged' property must be a boolean type.");
                        }

                        _isBeingDragged = value;
                    }
                },
                "isRendered": {
                    get: function () {
                        return this.containerElement !== "";
                    }
                }
            });

        // Init values
            this.desktopObj = desktopObj;
            this.appName = appName || "";
            this.UID = UID || desktopObj.generateUID();
            this.x = x || 100;
            this.y = y || 100;
            this.width = width || 320;
            this.height = height || 240;
            this.zIndex = zIndex || 1;
        };

        Constructor.prototype = {
            constructor: Constructor,

            // Render app
            render: function (content) {

                var that = this;

                // Create container
                this.containerElement = document.createElement("div");
                this.containerElement.classList.add("window");

                // Set container position
                this.containerElement.style.left = this.x + "px";
                this.containerElement.style.top = this.y + "px";

                // Fetch template
                require(["text!tpl/appcontainer.html"], function (template) {

                    // Render data in template
                    that.containerElement.innerHTML = Mustache.render(template, {appName: that.appName, content: content});

                    // Fetch references.
                    that.closeButton = that.containerElement.querySelector('a.close');
                    that.minifyButton = that.containerElement.querySelector('a.minify');
                    that.headerElement = that.containerElement.querySelector('div.header');
                    that.contentElement = that.containerElement.querySelector('div.content');

                    // Set content width
                    that.contentElement.style.width = that.width + "px";
                    that.contentElement.style.height = that.height + "px";

                    // Append appContainer to desktop

                    that.desktopObj.contentElement.appendChild(that.containerElement);

                    // Add events
                    that.addEvents();
                });
            },

            addEvents: function () {
                var that = this,
                    computedStyle,
                    x,
                    y,
                    offset,
                    dataTransferString;

                this.containerElement.addEventListener("click", function () {
                    that.desktopObj.focusApp(that);
                });

                this.closeButton.addEventListener("click", function () {

                    // Remove from DOM
                    that.containerElement.parentNode.removeChild(that.containerElement);

                    //!TODO Destroy/Remove this object from nonexisting windowmanager
                });

                this.minifyButton.addEventListener("click", function () {

                    // !TODO Hide window and add it to minified state in taskbar.
                });

                this.headerElement.addEventListener('dragstart', function (e) {

                    that.isBeingDragged = true;

                    // Get current css computed values of containerElement
                    computedStyle = window.getComputedStyle(that.containerElement, null);

                    // Parse and compute the data which should be passed when the drag is dropped.
                    x = (parseInt(computedStyle.getPropertyValue("left"), 10) - e.clientX);
                    y = (parseInt(computedStyle.getPropertyValue("top"), 10) - e.clientY);

                    // Format data transfer string.
                    dataTransferString = [that.UID, x, y].join(",");

                    // Set this data to be transferred until drop of element.
                    e.dataTransfer.setData("text", dataTransferString);

                });

                this.desktopObj.contentElement.addEventListener("dragover", function (e) {
                    e.preventDefault();
                    return false;
                });

            },

            moveTo: function (newX, newY) {
                this.containerElement.style.left = newX + "px";
                this.containerElement.style.top = newY + "px";
            }
        };

        return Constructor;

    }());
});

