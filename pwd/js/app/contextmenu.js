/**
 * Created by Johnny on 2015-01-06.
 */


"use strict";

define(["mustache", "app/extensions"], function (Mustache) {

    return (function () {

        var ContextMenu = function (appContainerObj, contextMenuInfoObj) {

            var _appContainerObj,
                _containerElement,
                _contextMenuInfoObj;

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
                            throw new Error("ContextMenus 'appContainerObj' property must be an object");
                        }
                    }
                },
                "contextMenuInfoObj": {
                    get: function () {
                        return _contextMenuInfoObj || "";
                    },

                    set: function (obj) {
                        if (obj !== null && typeof obj === "object") {
                            _contextMenuInfoObj = obj;
                        } else {
                            throw new Error("ContextMenus 'contextMenuInfoObj' property must be an object");
                        }
                    }
                },
                "containerElement": {
                    get: function () { return _containerElement || ""; },

                    set: function (element) {
                        if (element !== null && element.nodeName !== "undefined") {
                            _containerElement = element;
                        } else {
                            throw new Error("ContextMenus 'containerElement' property must be an element");
                        }
                    }
                }
            });

            // Init values
            this.appContainerObj = appContainerObj;
            this.contextMenuInfoObj = contextMenuInfoObj || {};

            this.create();
        };

        ContextMenu.prototype = {
            constructor: ContextMenu,

            create: function () {

                // Create and render ContextMenu (without data) on AppContainer
                this.containerElement = document.createElement("div");
                this.containerElement.classList.add("context-menu");

                // Flag appContainer to have a contextMenu, modify appearance
                this.appContainerObj.containerElement.classList.add("has-context-menu");

                // Insert contextMenu
                this.appContainerObj.containerElement.insertBefore(this.containerElement, this.appContainerObj.contentElement);
            },

            addMenuContent: function (menuContentInfoObj) {
                var hMenuElement,
                    that = this;

                this.contextMenuInfoObj = menuContentInfoObj;

                // Fetch template
                require(["text!tpl/contextmenu.html"], function (template) {
                    var i,
                        j,
                        content = "",
                        callbackFunction,
                        hmenuUlElement,
                        hmenuLiHeaderElement,
                        hmenuLiContainerElement,
                        umenuUlElement,
                        umenuLiElement;

                    // Loop through hmenus
                    Object.keys(menuContentInfoObj).forEach(function (hmenu) {

                        // Create elements
                        hmenuUlElement = document.createElement("ul");
                        hmenuLiHeaderElement = document.createElement("li");
                        umenuUlElement = document.createElement("ul");

                        // Create and hide umenu container
                        hmenuLiContainerElement = document.createElement("li");
                        hmenuLiContainerElement.classList.add("hidden");

                        // Keep object reference through closure
                        (function () {
                            var HeaderReference = hmenuLiHeaderElement,
                                ContainerReference = hmenuLiContainerElement;

                            // Show umenu on mouseover
                            HeaderReference.addEventListener("click", function (e) {
                                ContainerReference.classList.remove("hidden");
                            });
                        }());

                        // Set text
                        hmenuLiHeaderElement.textContent = hmenu;

                        // Build hmenu
                        hmenuUlElement.appendChild(hmenuLiHeaderElement);
                        hmenuUlElement.appendChild(hmenuLiContainerElement);
                        hmenuLiContainerElement.appendChild(umenuUlElement);

                        // Loop through umenus
                        Object.keys(menuContentInfoObj[hmenu]).forEach(function (umenu) {

                            // Get CallbackFunction from menu info object
                            callbackFunction = menuContentInfoObj[hmenu][umenu];

                            // Create elements
                            umenuLiElement = document.createElement("li");

                            // Set text
                            umenuLiElement.textContent = umenu;

                            // Keep object reference through closure
                            (function () {
                                var WholeMenuReference = hmenuUlElement,
                                    ContainerReference = hmenuLiContainerElement,
                                    callbackReference = callbackFunction;

                                umenuLiElement.addEventListener("click", function(){

                                    // Hide whole menu on click
                                    ContainerReference.classList.add("hidden");

                                    // Run callback function
                                    callbackReference();
                                });

                                // Hide umenu on mouseover
                                WholeMenuReference.addEventListener("mouseleave", function (e) {
                                    ContainerReference.classList.add("hidden");
                                });
                            }());

                            // Append to hmenu
                            umenuUlElement.appendChild(umenuLiElement);
                        });

                        // Append hmenu to contextMenu container
                        that.containerElement.appendChild(hmenuUlElement);
                    });

                    // Returnera referenser


                    /*
                     this.containerElement.innerHTML = "" +
                     "<ul>" +
                     "   <li>Inställningar</li>" +
                     "   <li>" +
                     "       <ul>" +
                     "           <li>Uppdateringsintervall</li>" +
                     "           <li>Avancerat</li>" +
                     "       </ul>" +
                     "   </li>" +
                     "</ul>" +
                     "<ul>" +
                     "   <li>Fler Inställningar</li>" +
                     "   <li>" +
                     "       <ul>" +
                     "           <li>Uppdateringsintervall</li>" +
                     "           <li>Avancerat</li>" +
                     "       </ul>" +
                     "   </li>" +
                     "</ul>";
                     */
                });
            }
        };

        return ContextMenu;

    }());
});