/**
 * Created by Johnny on 2015-01-09.
 */


"use strict";

define(["mustache", "popup", "app/extensions"], function (Mustache, Popup) {

    return (function () {

        // Set up namespace
        var PWD = PWD || {};
        PWD.Desktop = PWD.Desktop || {};
        PWD.Desktop.AppContainer = PWD.Desktop.AppContainer || {};

        // Declare Paint app
        PWD.Desktop.AppContainer.Paint = function (appContainerObj) {

            var _appContainerObj,
                _canvasElement,
                _colorElements,
                _canvas2d,
                _offset,
                _isPainting,
                _currentColor,
                _xTrace = [],
                _yTrace = [],
                _dragTrace = [],
                _colorTrace = [],
                _PARENT_H_OFFSET = 23,
                _PARENT_W_OFFSET = 17,
                _MIN_DIMENSIONS = { width: 250, height: 100 };

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
                "colorElements": {
                    get: function () { return _colorElements || ""; },

                    set: function (obj) {
                        if (obj !== null && typeof obj === "object") {
                            _colorElements = obj;
                        } else {
                            throw new Error("Paints 'colorElements' property must be an object");
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
                },
                "colorTrace": {
                    get: function () {
                        return _colorTrace || "";
                    },

                    set: function (array) {
                        if (array !== null && array instanceof Array) {

                            _colorTrace = array;

                        } else {
                            throw new Error("Paints 'colorTrace' property must be an array");
                        }
                    }
                },
                "PARENT_H_OFFSET": {
                    get: function () {
                        return _PARENT_H_OFFSET || "";
                    }
                },
                "PARENT_W_OFFSET": {
                    get: function () {
                        return _PARENT_W_OFFSET || "";
                    }
                },
                "MAX_DIMENSIONS": {
                    get: function () {

                        return {
                            width: parseInt(window.innerWidth, 10) - parseInt(this.offset.x, 10) - 10,
                            height: parseInt(window.innerHeight, 10) - parseInt(this.offset.y, 10) - 10
                        };
                    }
                },
                "MIN_DIMENSIONS": {
                    get: function () {
                        return _MIN_DIMENSIONS;
                    }
                }
            });

        // Init values
            this.appContainerObj = appContainerObj;
            this.currentColor = "#000000";

        // Private methods
            this.run = function () {

                this.createElements();

                // Add contextMenu
                this.appContainerObj.contextMenuObj.addMenuContent(this.defineContextMenuSettings());

            };
        };

        PWD.Desktop.AppContainer.Paint.prototype = {
            constructor: PWD.Desktop.AppContainer.Paint,

            createElements: function () {
                var that = this,
                    height,
                    width;

                // Clear content
                this.appContainerObj.clearContent();

                // Fetch template
                require(["text!tpl/appcontainer/paint/paint.html"], function (template) {

                    // Figure out dimensions
                    width = parseInt(window.getComputedStyle(that.appContainerObj.contentElement).getPropertyValue("width"), 10);
                    height = parseInt(window.getComputedStyle(that.appContainerObj.contentElement).getPropertyValue("height"), 10);

                    // Render data in template
                    that.appContainerObj.contentElement.innerHTML = Mustache.render(template, {width: width, height: height});

                    // Get canvas reference
                    that.canvasElement = that.appContainerObj.contentElement.querySelector("canvas");
                    that.canvas2d = that.canvasElement.getContext("2d");

                    // Get color references
                    that.colorElements = that.appContainerObj.contentElement.querySelectorAll(".color-bar div");

                    // Attach events
                    that.attachEvents();

                    // Set offset.
                    that.setOffset();
                });
            },

            defineContextMenuSettings: function () {
                var that = this,
                    contextMenuInfoObj,
                    savedCanvasData,
                    backgroundImageElement,
                    oldBackgroundImageElement;

                // Setup settings for this appContainers contextMenu.
                contextMenuInfoObj = {
                    "Arkiv": {
                        "Ny bild": function () {
                            that.clear();
                            that.forgetTrace();
                        },
                        "Lägg till som bakgrund": function () {

                            // Remove old images
                            oldBackgroundImageElement = document.querySelector("img.painted-bg-image");
                            if (oldBackgroundImageElement) {
                                document.body.removeChild(oldBackgroundImageElement);
                            }

                            // Create new image
                            savedCanvasData = that.canvasElement.toDataURL();
                            backgroundImageElement = document.createElement("img");
                            backgroundImageElement.classList.add("painted-bg-image");
                            backgroundImageElement.src = savedCanvasData;
                            document.body.insertBefore(backgroundImageElement, document.body.firstChild);
                        }
                    },
                    "Inställningar": {
                        "Bildstorlek": function () {
                            that.popupImageSizeOptions();

                        }
                    }
                };

                return contextMenuInfoObj;
            },

            popupImageSizeOptions: function () {
                var enterImageSizeContent;

                enterImageSizeContent = this.createEnterImageSizeContent();
                new Popup(this.appContainerObj, "Ange bildstorlek", enterImageSizeContent);
            },

            createEnterImageSizeContent: function () {

                var containerElement,
                    widthInputElement,
                    widthTextNode,
                    heightInputElement,
                    errorElement,
                    heightTextNode,
                    submitElement,
                    that = this;

                // Create container element
                containerElement = document.createElement("div");

                // Create elements
                widthInputElement = document.createElement("input");
                heightInputElement = document.createElement("input");
                submitElement = document.createElement("button");
                errorElement = document.createElement("div");

                widthTextNode = document.createTextNode("Bredd:");
                heightTextNode = document.createTextNode("Höjd:");

                widthInputElement.setAttribute("type", "text");
                heightInputElement.setAttribute("type", "text");

                widthInputElement.value = this.canvasElement.width;
                heightInputElement.value = this.canvasElement.height;

                widthInputElement.style.width = "50px";
                widthInputElement.style.marginRight = "10px";
                heightInputElement.style.width = "50px";

                errorElement.style.color = "#AA0000";

                submitElement.innerHTML = "Verkställ";
                submitElement.classList.add("submitbutton");

                // Action on submit
                submitElement.addEventListener("click", function () {

                    // If the given dimensions are too high
                    if (that.MAX_DIMENSIONS.width < +widthInputElement.value || that.MAX_DIMENSIONS.height < +heightInputElement.value) {
                        errorElement.innerHTML = "Max bredd är: " + that.MAX_DIMENSIONS.width + ".<br>Max höjd är: " + that.MAX_DIMENSIONS.height;
                    } else if (that.MIN_DIMENSIONS.width > +widthInputElement.value || that.MIN_DIMENSIONS.height > +heightInputElement.value) {
                        errorElement.innerHTML = "Minimum bredd är: " + that.MIN_DIMENSIONS.width + ".<br>Minimum höjd är: " + that.MIN_DIMENSIONS.height;
                    } else {

                        that.canvasElement.width = widthInputElement.value;
                        that.canvasElement.height = heightInputElement.value;
                        that.appContainerObj.width = parseInt(widthInputElement.value, 10) + that.PARENT_W_OFFSET;
                        that.appContainerObj.height = parseInt(heightInputElement.value, 10) + that.PARENT_H_OFFSET + 37;

                        that.redraw();
                        that.appContainerObj.closePopups();
                    }
                });

                // Add elements to container element
                containerElement.appendChild(widthTextNode);
                containerElement.appendChild(widthInputElement);
                containerElement.appendChild(heightTextNode);
                containerElement.appendChild(heightInputElement);
                containerElement.appendChild(errorElement);
                containerElement.appendChild(submitElement);

                // Return containerElement
                return containerElement;
            },

            setOffset: function () {
                this.offset = this.canvasElement.leftTopScreen();
            },

            attachEvents: function () {
                var that = this;

                // Color elements
                this.colorElements.forEach(function (element) {

                    // Make the colors display their current color.
                    element.style.backgroundColor = element.dataset.color;

                    // Change current color och mousedown
                    element.addEventListener("mousedown", function () {

                        // Add selected color class to new color
                        that.selectColorEvent(element);
                    });
                });

                this.appContainerObj.headerElement.addEventListener("mouseleave", function () {
                    that.setOffset();
                });

                this.canvasElement.addEventListener("mousedown", function (e) {
                    e.preventDefault();

                    that.setOffset();

                    that.isPainting = true;
                    that.traceDraw(
                        e.pageX - this.offsetLeft - that.offset.x,
                        e.pageY - this.offsetTop - that.offset.y,
                        that.currentColor
                    );
                    that.redraw();
                });

                this.canvasElement.addEventListener("mousemove", function (e) {
                    if (that.isPainting) {
                        that.traceDraw(
                            e.pageX - this.offsetLeft - that.offset.x,
                            e.pageY - this.offsetTop - that.offset.y,
                            that.currentColor,
                            true
                        );
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

            selectColorEvent: function (newSelectedColorElement) {
                // Assign new current color
                this.currentColor = newSelectedColorElement.dataset.color;

                // Remove old selected class.
                this.colorElements.forEach(function (colorElement) {
                    colorElement.classList.remove("selected-color");
                });

                // Set selected class to color element
                newSelectedColorElement.classList.add("selected-color");
            },

            traceDraw: function (x, y, color, isDragged) {
                this.xTrace.push(x);
                this.yTrace.push(y);
                this.dragTrace.push(isDragged);
                this.colorTrace.push(color);
            },

            clear: function () {
                this.canvas2d.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
            },

            forgetTrace: function () {
                this.xTrace = [];
                this.yTrace = [];
                this.dragTrace = [];
                this.colorTrace = [];
            },

            redraw: function () {
                var i;

                 // Clears the canvas
                this.clear();

                //this.canvas2d.strokeStyle = this.currentColor;
                this.canvas2d.lineJoin = "round";
                this.canvas2d.lineWidth = 5;

                for (i = 0; i < this.xTrace.length; i++) {
                    this.canvas2d.beginPath();
                    if (this.dragTrace[i] && i) {
                        this.canvas2d.moveTo(this.xTrace[i - 1], this.yTrace[i - 1]);
                    } else {
                        this.canvas2d.moveTo(this.xTrace[i] - 1, this.yTrace[i]);
                    }
                    this.canvas2d.lineTo(this.xTrace[i], this.yTrace[i]);
                    this.canvas2d.closePath();
                    this.canvas2d.strokeStyle = this.colorTrace[i];
                    this.canvas2d.stroke();
                }
            }
        };

        return PWD.Desktop.AppContainer.Paint;

    }());

});