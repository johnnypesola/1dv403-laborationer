/**
 * Created by Johnny on 2015-01-03.
 */

"use strict";

define(["app/extensions"], function () {

    return (function () {

        var Constructor = function (desktopObj) {

            var _desktopObj,
                _contentElement;

        // Properties with Getters and Setters
            Object.defineProperties(this, {
                "desktopObj": {
                    get: function () { return _desktopObj || ""; },

                    set: function (obj) {
                        if (obj !== null && typeof obj === "object") {
                            _desktopObj = obj;
                        } else {
                            throw new Error("StartMenus 'desktopObj' property must be an object");
                        }
                    }
                },
                "contentElement": {
                    get: function () { return _contentElement || ""; },

                    set: function (element) {
                        if (element !== null && element.nodeName !== "undefined") {
                            _contentElement = element;
                        } else {
                            throw new Error("StartMenus 'contentElement' property must be an element");
                        }
                    }
                }
            });

        // Init values
            this.desktopObj = desktopObj;
        };

        Constructor.prototype = {
            constructor: Constructor,

            // Render app
            render: function (content) {

                var that = this,
                    i,
                    img;

                // Create container
                this.containerElement = document.createElement("div");
                this.containerElement.setAttribute("id", "startmenu");

                // Add available apps to startmenu
                for (i = 0; i < this.desktopObj.availableApps.length; i++) {

                    // Add icon for only visible apps
                    if (!this.desktopObj.availableApps[i].ishiddenFromStartMenu) {

                        // Create image element
                        img = document.createElement("img");
                        img.setAttribute("src", this.desktopObj.availableApps[i].icon);

                        // Add event for image element
                        this.addStartAppEvent(img, this.desktopObj.availableApps[i]);

                        // Add image to menu
                        this.containerElement.appendChild(img);
                    }
                }

                // Add startmenu element to desktop
                this.desktopObj.contentElement.appendChild(this.containerElement);

                // Add events
//                this.addEvents();

            },

            addStartAppEvent: function (element, appInfoObj) {
                var that = this;

                element.addEventListener("click", function (e) {
                    that.desktopObj.startApp(appInfoObj);
                });
            }
        };


        return Constructor;

    }());
});
