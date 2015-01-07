/**
 * Created by Johnny on 2015-01-06.
 */


"use strict";

define(["mustache", "app/extensions"], function (Mustache) {

    return (function () {

        var PopUp = function (appContainerObj, type, content) {

            var _appContainerObj,
                _containerElement,
                _type,
                _content;

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
                "type": {
                    get: function () { return _type || ""; },

                    set: function (value) {
                        if (value !== null && typeof value === "string") {

                            _type = value;

                        } else {
                            throw new Error("Popups 'type' property must be a string.");
                        }
                    }
                },
                "content": {
                    get: function () { return _content || ""; },

                    set: function (value) {
                        if (value !== null && typeof value === "string") {

                            _content = value;

                        } else {
                            throw new Error("Popups 'content' property must be a string.");
                        }
                    }
                }
            });

            // Init values
            this.appContainerObj = appContainerObj;
            this.content = content;
            this.create();
        };

        PopUp.prototype = {
            constructor: PopUp,

            create: function () {

                // Create and render Popup (without data) on AppContainer
                this.containerElement = document.createElement("div");
                this.containerElement.classList.add("popup");

                // Add Popup to AppContainers content.
                this.appContainerObj.containerElement.appendChild(this.containerElement);
            },

            addMenuContent: function (menuContentInfoObj) {
                var that = this;

                // Get Menu Content Info Object from a App, and store it locally.
                //this.contextMenuInfoObj = menuContentInfoObj;

                // Loop through hmenus
                Object.keys(menuContentInfoObj).forEach(function (hmenu) {

                    // Loop through umenus
                    Object.keys(menuContentInfoObj[hmenu]).forEach(function (umenu) {

                    });

                });
            }

        };

        return PopUp;

    }());
});