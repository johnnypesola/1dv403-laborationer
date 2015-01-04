/**
 * Created by Johnny on 2015-01-03.
 */

define(["mustache", "app/desktop", "app/extensions"], function(Mustache, AppContainer) {

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
                            throw new Error("Startmenus 'desktopObj' property must be an object");
                        }
                    }
                },
                "contentElement": {
                    get: function () { return _contentElement || ""; },

                    set: function (element) {
                        if (element !== null && element.nodeName !== "undefined") {
                            _contentElement = element;
                        } else {
                            throw new Error("Startmenus 'contentElement' property must be an element");
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

                var that = this;

                // Create container
                this.containerElement = document.createElement("div");
                this.containerElement.classList.add("window");

                // Fetch template
                require(["text!tpl/appcontainer.html"], function (template) {

                    // Render data in template
                    that.containerElement.innerHTML = Mustache.render(template, {appName: that.appName, content: content});

                    // Fetch references.
                    that.closeButton = that.containerElement.querySelector('a.close');
                    that.minifyButton = that.containerElement.querySelector('a.minify');
                    that.headerElement = that.containerElement.querySelector('div.header');
                    that.contentElement = that.containerElement.querySelector('div.content');
                    that.resizeElement = that.containerElement.querySelector('img.resize');

                    // Set size
                    that.resizeTo(that.width, that.height);

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
            }
        };


        return Constructor;

    }());
});
