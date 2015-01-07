/**
 * Created by Johnny on 2015-01-06.
 */


"use strict";

define(["mustache", "app/extensions"], function (Mustache) {

    return (function () {

        var Popup = function (appContainerObj, header, content) {

            var _appContainerObj,
                _containerElement,
                _contentElement,
                _headerElement,
                _header,
                _content,
                _closeButton;

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
                            throw new Error("Popups 'appContainerObj' property must be an object");
                        }
                    }
                },
                "containerElement": {
                    get: function () { return _containerElement || ""; },

                    set: function (element) {
                        if (element !== null && element.nodeName !== "undefined") {
                            _containerElement = element;
                        } else {
                            throw new Error("Popups 'containerElement' property must be an element");
                        }
                    }
                },
                "headerElement": {
                    get: function () { return _headerElement || ""; },

                    set: function (element) {
                        if (element !== null && element.nodeName !== "undefined") {
                            _headerElement = element;
                        } else {
                            throw new Error("Popups 'headerElement' property must be an element");
                        }
                    }
                },
                "contentElement": {
                    get: function () { return _contentElement || ""; },

                    set: function (element) {
                        if (element !== null && element.nodeName !== "undefined") {
                            _contentElement = element;
                        } else {
                            throw new Error("Popups 'contentElement' property must be an element");
                        }
                    }
                },
                "header": {
                    get: function () { return _header || ""; },

                    set: function (value) {
                        if (value !== null && typeof value === "string") {

                            _header = value;

                        } else {
                            throw new Error("Popups 'header' property must be a string.");
                        }
                    }
                },
                "content": {
                    get: function () { return _content || ""; },

                    set: function (element) {
                        if (element !== null && element.nodeName !== "undefined") {
                            _content = element;
                        } else {
                            throw new Error("Popups 'content' property must be an element");
                        }
                    }
                },
                "closeButton": {
                    get: function () { return _closeButton || ""; },

                    set: function (element) {
                        if (element !== null && element.nodeName !== "undefined") {
                            _closeButton = element;
                        } else {
                            throw new Error("Popups 'closeButton' property must be an element");
                        }
                    }
                }
            });

            // Init values
            this.appContainerObj = appContainerObj;
            this.header = header;
            this.content = content;
            this.create();
        };

        Popup.prototype = {
            constructor: Popup,

            // Create and render Popup (without data) on AppContainer
            create: function () {
                var that = this;

                // Create container element
                this.containerElement = document.createElement("div");
                this.containerElement.classList.add("popup");

                // Fetch template
                require(["text!tpl/popup.html"], function (template) {

                    // Render data in template
                    that.containerElement.innerHTML = Mustache.render(template, {header: that.header});

                    // Get references
                    that.headerElement = that.containerElement.querySelector('.header');
                    that.contentElement = that.containerElement.querySelector('.content');
                    that.closeButtonElement = that.containerElement.querySelector('a.close');

                    // Add content to Popup
                    that.contentElement.appendChild(that.content);

                    // Add click event to close button
                    that.closeButtonElement.addEventListener("click", function () {

                        // Remove from DOM
                        that.containerElement.parentNode.removeChild(that.containerElement);
                    });

                    // Prevent drag of closebutton.
                    that.closeButtonElement.addEventListener("dragstart", function (e) {
                        e.preventDefault();
                    });

                    // Prevent selection of header element.
                    that.headerElement.addEventListener("dragstart", function (e) {
                        e.preventDefault();
                    });

                    // Add Popup to AppContainers content.
                    that.appContainerObj.containerElement.appendChild(that.containerElement);
                });
            }
        };

        return Popup;

    }());
});