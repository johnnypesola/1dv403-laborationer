/**
 * Created by Johnny on 2015-01-09.
 */


"use strict";

define(["mustache", "app/popup", "app/extensions"], function (Mustache, Popup) {

    return (function () {

        var Paint = function (appContainerObj) {

            var _appContainerObj,
                _canvasElement,
                _canvas2d,
                _offset,
                _isPainting,
                _currentColor,
                _xTrace = [],
                _yTrace = [],
                _dragTrace = [];

        // Properties with Getters and Setters
            Object.defineProperties(this, {

                "appContainerObj": {
                    get: function () {
                        return _appContainerObj || "";
                    },

                    set: function (obj) {
                        if (obj !== null && typeof obj === "object") {
                            _appContainerObj = obj;
                        } else {
                            throw new Error("Paints 'appContainerObj' property must be an object");
                        }
                    }
                },
                "canvas2d": {
                    get: function () {
                        return _canvas2d || "";
                    },

                    set: function (obj) {
                        if (obj !== null && typeof obj === "object") {
                            _canvas2d = obj;
                        } else {
                            throw new Error("Paints 'canvas2d' property must be an object");
                        }
                    }
                },
                "canvasElement": {
                    get: function () { return _canvasElement || ""; },

                    set: function (element) {
                        if (element !== null && element.nodeName !== "undefined") {
                            _canvasElement = element;
                        } else {
                            throw new Error("Paints 'canvasElement' property must be an element");
                        }
                    }
                },
                "offset": {
                    get: function () {
                        return _offset || "";
                    },

                    set: function (obj) {
                        if (obj !== null && typeof obj === "object") {
                            _offset = obj;
                        } else {
                            throw new Error("Paints 'offset' property must be an object");
                        }
                    }
                },
                "isPainting": {
                    get: function () { return _isPainting; },
                    set: function (value) {
                        if (typeof value !== "boolean") {
                            throw new Error("Paints 'isPainting' property must be a boolean type.");
                        }

                        // Set value
                        _isPainting = value;
                    }
                },
                "currentColor": {
                    get: function () { return _currentColor || ""; },

                    set: function (value) {
                        if (value !== null && typeof value === "string") {
                            _currentColor = value;
                        } else {
                            throw new Error("Paints 'cssClass' property must be a string.");
                        }
                    }
                },
                "xTrace": {
                    get: function () {
                        return _xTrace || "";
                    },

                    set: function (array) {
                        if (array !== null && array instanceof Array) {

                            _xTrace = array;

                        } else {
                            throw new Error("Paints 'xTrace' property must be an array");
                        }
                    }
                },
                "yTrace": {
                    get: function () {
                        return _yTrace || "";
                    },

                    set: function (array) {
                        if (array !== null && array instanceof Array) {

                            _yTrace = array;

                        } else {
                            throw new Error("Paints 'yTrace' property must be an array");
                        }
                    }
                },
                "dragTrace": {
                    get: function () {
                        return _dragTrace || "";
                    },

                    set: function (array) {
                        if (array !== null && array instanceof Array) {

                            _dragTrace = array;

                        } else {
                            throw new Error("Paints 'dragTrace' property must be an array");
                        }
                    }
                }
            });

        // Init values
            this.appContainerObj = appContainerObj;

        // Private methods
            this.run = function () {

                this.createElements();

                // Add contextMenu
                this.appContainerObj.contextMenuObj.addMenuContent(this.defineContextMenuSettings());
            };
        };

        Paint.prototype = {
            constructor: Paint,

            createElements: function () {
                var that = this,
                    height,
                    width;

                // Clear content
                this.appContainerObj.clearContent();

                // Fetch template
                require(["text!tpl/paint.html"], function (template) {

                    // Figure out dimensions
                    width = parseInt(window.getComputedStyle(that.appContainerObj.contentElement).getPropertyValue("width"), 10);
                    height = parseInt(window.getComputedStyle(that.appContainerObj.contentElement).getPropertyValue("height"), 10);

                    // Apply offset.
                    width -= 17;
                    height -= 23;

                    // Render data in template
                    that.appContainerObj.contentElement.innerHTML = Mustache.render(template, {width: width, height: height});

                    // Get canvas reference
                    that.canvasElement = that.appContainerObj.contentElement.querySelector("canvas");
                    that.canvas2d = that.canvasElement.getContext("2d");

                    // Attach events
                    that.attachEvents();
                });
            },

            defineContextMenuSettings: function () {
                var that = this,
                    contextMenuInfoObj;

                // Setup settings for this appContainers contextMenu.
                contextMenuInfoObj = {
                    "Arkiv": {
                        "Ny bild": function () {
                            that.clear();
                            that.forgetTrace();
                        }
                    },
                    "Inställningar": {
                        "Bildstorlek": function () {
                            that.popupUpdateIntervalOptions();

                        }
                    }
                };

                return contextMenuInfoObj;
            },

            setOffset: function () {
                this.offset = this.canvasElement.leftTopScreen();
            },

            attachEvents: function () {
                var mouseX,
                    mouseY,
                    offset,
                    that = this;

                this.canvasElement.addEventListener("mousedown", function (e) {
                    e.preventDefault();
                    //mouseX = e.layerX; //e.pageX - this.offsetLeft;
                    //mouseY = e.layerY; //e.pageY - this.offsetTop;

                    that.setOffset();

                    that.isPainting = true;
                    that.traceDraw(e.pageX - this.offsetLeft - that.offset.x, e.pageY - this.offsetTop - that.offset.y);
                    that.redraw();
                });

                this.canvasElement.addEventListener("mousemove", function (e) {
                    if (that.isPainting) {
                        that.traceDraw(e.pageX - this.offsetLeft - that.offset.x, e.pageY - this.offsetTop - that.offset.y, true);
                        that.redraw();
                    }
                });

                this.canvasElement.addEventListener("mouseup", function () {
                    that.isPainting = false;
                });

                this.canvasElement.addEventListener("mouseleave", function () {
                    that.isPainting = false;
                });
            },

            traceDraw: function (x, y, isDragged) {
                this.xTrace.push(x);
                this.yTrace.push(y);
                this.dragTrace.push(isDragged);
            },

            clear: function () {
                this.canvas2d.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
            },

            forgetTrace: function () {
                this.xTrace = [];
                this.yTrace = [];
                this.dragTrace = [];
            },

            redraw: function () {
                var i;

                 // Clears the canvas
                this.clear();

                this.canvas2d.strokeStyle = "#df4b26";
                this.canvas2d.lineJoin = "round";
                this.canvas2d.lineWidth = 5;

                for (i = 0; i < this.xTrace.length; i++) {
                    this.canvas2d.beginPath();
                    if (this.dragTrace[i] && i) {
                        this.canvas2d.moveTo(this.xTrace[i-1], this.yTrace[i-1]);
                    } else {
                        this.canvas2d.moveTo(this.xTrace[i]-1, this.yTrace[i]);
                    }
                    this.canvas2d.lineTo(this.xTrace[i], this.yTrace[i]);
                    this.canvas2d.closePath();
                    this.canvas2d.stroke();
                }
            },

            // Update Rss feed.
            update: function () {
                var that = this;

                // Set loading image in app.
                this.appContainerObj.renderAsLoading();

                // Fetch remote data and fill imagesDataArray, done in private.
                this.appContainerObj.desktopObj.ajaxCall("GET", this.REMOTE_PROXY_URL + this.rssFeedSourceURL, function (httpRequest) {
                    that.handleAjaxResponse(httpRequest);
                });
            }
        };

        return Paint;

    }());

});