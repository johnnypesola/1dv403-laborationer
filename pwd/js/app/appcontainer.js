/**
 * Created by Johnny on 2015-01-03.
 */

"use strict";

define(["mustache", "app/extensions"], function (Mustache) {

    return (function () {

        var Constructor = function (desktopObj, appName, UID, icon, x, y, width, height, zIndex, isResizeable) {

            var _desktopObj,
                _appName,
                _UID,
                _icon,
                _x,
                _y,
                _width,
                _height,
                _zIndex,
                _minifyButton,
                _closeButton,
                _resizeElement,
                _containerElement,
                _runningApp,
                _headerElement,
                _headerTextElement,
                _contentElement,
                _isBeingDragged = false,
                _isBeingResized = false,
                _isResizeable;

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
                "icon": {
                    get: function () { return _icon || ""; },

                    set: function (value) {
                        if (value !== null && typeof value === "string") {

                            _icon = value;

                            // Display icon on app header.
                            if (this.isRendered) {
                                this.headerElement.style.backgroundImage = value;
                            }

                        } else {
                            throw new Error("AppContainers 'icon' property must be a string.");
                        }
                    }
                },
                "x": {
                    get: function () { return _x || ""; },

                    set: function (value) {
                        var parsedValue = parseFloat(value),
                            actualWidth;

                        if (parsedValue.isInt()) {

                            // Try to get calculated css width
                            if (_x) {
                                actualWidth = parseInt(window.getComputedStyle(this.containerElement, null).getPropertyValue("width"), 10);
                            }

                            // Don't let the window outside boundaries.
                            if (!(parsedValue < 0 || (actualWidth && parsedValue + actualWidth > this.desktopObj.contentElement.offsetWidth))) {
                                _x = parsedValue;
                            }

                            // Apply this value to html if this app is rendered
                            if (this.isRendered) {
                                this.containerElement.style.left = _x + "px";
                            }

                        } else {
                            throw new Error("AppContainers 'x' property must be an int.");
                        }
                    }
                },
                "y": {
                    get: function () { return _y || ""; },

                    set: function (value) {
                        var parsedValue = parseFloat(value),
                            actualHeight;

                        if (parsedValue.isInt() && parsedValue >= 0) {

                            // Try to get calculated css width
                            if (_y) {
                                actualHeight = parseInt(window.getComputedStyle(this.containerElement, null).getPropertyValue("height"), 10);
                            }

                            // Don't let the window outside boundaries.
                            if (!(parsedValue < 0 || (actualHeight && parsedValue + actualHeight > this.desktopObj.contentElement.offsetHeight))) {
                                _y = parsedValue;
                            }

                            // Apply this value if this app is rendered
                            if (this.isRendered) {
                                this.containerElement.style.top = _y + "px";
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
                                this.containerElement.style.height = parsedValue + "px";
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
                "resizeElement": {
                    get: function () { return _resizeElement || ""; },

                    set: function (element) {
                        if (element !== null && element.nodeName !== "undefined") {
                            _resizeElement = element;
                        } else {
                            throw new Error("AppContainers 'resizeElement' property must be an element");
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
                "headerTextElement": {
                    get: function () { return _headerTextElement || ""; },

                    set: function (element) {
                        if (element !== null && element.nodeName !== "undefined") {
                            _headerTextElement = element;
                        } else {
                            throw new Error("AppContainers 'headerTextElement' property must be an element");
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

                            // Set position of contentElement
                            this.containerElement.style.left = this.x + "px";
                            this.containerElement.style.top = this.y + "px";

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

                        // Set value
                        _isBeingDragged = value;

                        // Add or remove CSS class on this containerElement and also Desktop
                        if (value) {
                            this.desktopObj.appIsBeingDragged = true;
                            this.containerElement.classList.add("being-dragged");
                        } else {
                            this.desktopObj.appIsBeingDragged = false;
                            this.containerElement.classList.remove("being-dragged");
                        }

                    }
                },
                "isBeingResized": {
                    get: function () { return _isBeingDragged; },
                    set: function (value) {
                        if (typeof value !== "boolean") {
                            throw new Error("AppContainers 'isBeingResized' property must be a boolean type.");
                        }

                        // Set value
                        _isBeingResized = value;

                        // Add or remove CSS class on this containerElement and also Desktop
                        if (value) {
                            this.desktopObj.appIsBeingResized = true;
                            this.containerElement.classList.add("being-resized");
                        } else {
                            this.desktopObj.appIsBeingResized = false;
                            this.containerElement.classList.remove("being-resized");
                        }

                    }
                },
                "isResizeable": {
                    get: function () { return _isResizeable; },
                    set: function (value) {
                        if (typeof value !== "boolean") {
                            throw new Error("AppContainers 'isResizeable' property must be a boolean type.");
                        }

                        // Set value
                        _isResizeable = value;
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
            this.icon = icon || "";
            this.UID = UID || desktopObj.generateUID();
            this.x = x || 100;
            this.y = y || 100;
            this.width = width || 320;
            this.height = height || 240;
            this.zIndex = zIndex || 1;
            this.isResizeable = (typeof isResizeable === "boolean" ? isResizeable : true);

        };

        Constructor.prototype = {
            constructor: Constructor,

            // Render app
            render: function (content) {

                var that = this;

                // Create container
                this.containerElement = document.createElement("div");
                this.containerElement.classList.add("window");

                // Fetch template
                require(["text!tpl/appcontainer.html"], function (template) {

                    // Render data in template
                    that.containerElement.innerHTML = Mustache.render(template, {appName: that.appName, content: content, icon: that.icon});

                    // Fetch references.
                    that.closeButton = that.containerElement.querySelector('a.close');
                    that.minifyButton = that.containerElement.querySelector('a.minify');
                    that.headerElement = that.containerElement.querySelector('div.header');
                    that.headerTextElement = that.containerElement.querySelector('div.header h2');
                    that.contentElement = that.containerElement.querySelector('div.content');
                    that.resizeElement = that.containerElement.querySelector('img.resize');

                    console.log(that.headerTextElement);

                    // Set size
                    that.resizeTo(that.width, that.height);

                    // Set icon, (will actually render the icon to app header)
                    that.icon = that.icon;

                    // Append appContainer to desktop
                    that.desktopObj.contentElement.appendChild(that.containerElement);

                    // Add events
                    that.addEvents();
                });
            },

            addEvents: function () {
                var that = this;

                this.addDragAppEvent();

                this.addCloseAppEvent();

                this.addResizeAppEvent();

                this.addMinifyAppEvent();

                // Focus whole app on mousedown
                this.containerElement.addEventListener('mousedown', function (e) {
                    that.desktopObj.focusApp(that);
                });
            },

            addCloseAppEvent: function () {
                var that = this;

                this.closeButton.addEventListener('mousedown', function (e) {
                    e.stopPropagation();


                });

                this.closeButton.addEventListener('click', function (e) {

                    // Remove from DOM
                    that.containerElement.parentNode.removeChild(that.containerElement);

                    //Destroy/Remove this object from Desktop
                    that.desktopObj.closeApp(that);

                });
            },

            addMinifyAppEvent: function () {
                this.minifyButton.addEventListener("click", function () {
                    console.log("not implemented yet");
                });
            },

            addDragAppEvent: function () {

                var that = this,
                    offset;

                function moveFunction (e) {
                    that.moveTo(e.pageX - offset.x, e.pageY - offset.y);
                }

                this.headerElement.addEventListener('mousedown', function (e) {

                    offset = {
                        x: e.pageX - that.containerElement.offsetLeft,
                        y: e.pageY - that.containerElement.offsetTop
                    };

                    that.desktopObj.contentElement.addEventListener('mousemove', moveFunction);
                    that.isBeingDragged = true;

                });

                this.desktopObj.contentElement.addEventListener('mouseup', function (e) {
                    that.desktopObj.contentElement.removeEventListener('mousemove', moveFunction);

                    that.isBeingDragged = false;
                });

                this.headerElement.addEventListener('dragstart', function (e) {
                    e.preventDefault();
                    return false;
                });

                this.desktopObj.contentElement.addEventListener("dragover", function (e) {
                    e.preventDefault();
                    return false;
                });
            },

            addResizeAppEvent: function () {
                var that = this,
                    offset;

                // Declare function to bind to mousemove eventhandlers
                function resizeFunction (e) {
                    that.resizeTo(e.pageX - offset.x, e.pageY - offset.y);
                }

                // Only make resizable if exists in config
                if (this.isResizeable) {

                    this.resizeElement.addEventListener('mousedown', function (e) {

                        offset = {
                            x: e.pageX - that.containerElement.offsetWidth,
                            y: e.pageY - that.containerElement.offsetHeight
                        };

                        that.desktopObj.contentElement.addEventListener('mousemove', resizeFunction);

                        that.isBeingResized = true;
                    });

                    this.desktopObj.contentElement.addEventListener('mouseup', function (e) {
                        that.desktopObj.contentElement.removeEventListener('mousemove', resizeFunction);

                        that.isBeingResized = false;
                    });
                } else {
                    // Hide resize element
                    this.resizeElement.classList.add("hidden");
                }

                // Prevent default drag behaviour
                this.resizeElement.addEventListener('dragstart', function (e) {
                    e.preventDefault();
                    return false;
                });

            },

            resizeTo: function (newWidth, newHeight) {
                this.width = newWidth;
                this.height = newHeight;
            },

            moveTo: function (newX, newY) {
                this.x = newX;
                this.y = newY;
            }
        };

        return Constructor;

    }());
});

