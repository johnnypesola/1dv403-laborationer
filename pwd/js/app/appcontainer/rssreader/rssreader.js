/**
 * Created by Johnny on 2015-01-06.
 */


"use strict";

define(["mustache", "popup", "app/extensions"], function (Mustache, Popup) {

    return (function () {

        // Set up namespace
        var PWD = PWD || {};
        PWD.Desktop = PWD.Desktop || {};
        PWD.Desktop.AppContainer = PWD.Desktop.AppContainer || {};

        // Declare RssReader
        PWD.Desktop.AppContainer.RssReader = function (appContainerObj) {


            var _REMOTE_PROXY_URL = "http://homepage.lnu.se/staff/tstjo/labbyServer/rssproxy/?url=",
                _MAX_UPDATE_INTERVAL = 10,
                _AVAILABLE_RSS_SOURCES = [
                    {
                        name: "DN.se",
                        src: "http://www.dn.se/m/rss/senaste-nytt"
                    },
                    {
                        name: "Aftonbladet.se",
                        src: "http://www.aftonbladet.se/rss.xml"
                    },
                    {
                        name: "IDG Lagring",
                        src: "http://www.idg.se/rss/lagring"
                    }
                ],
                _rssFeedSourceURL,
                _rssDataArray,
                _appContainerObj,
                _updateInterval,
                _updateIntervalID;

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
                            throw new Error("RssReaders 'appContainerObj' property must be an object");
                        }
                    }
                },
                "rssFeedSourceURL": {
                    get: function () { return _rssFeedSourceURL || ""; },

                    set: function (value) {
                        if (value !== null && typeof value === "string") {
                            _rssFeedSourceURL = value;
                        } else {
                            throw new Error("RssReaders 'rssFeedSourceURL' property must be a string.");
                        }
                    }
                },
                "rssDataArray": {
                    get: function () {
                        return _rssDataArray || "";
                    },

                    set: function (array) {
                        if (array !== null && array instanceof Array) {

                            _rssDataArray = array;

                        } else {
                            throw new Error("RssReaders 'rssDataArray' property must be an array");
                        }
                    }
                },
                "updateInterval": {
                    get: function () { return _updateInterval || ""; },

                    set: function (value) {
                        var parsedValue = parseFloat(value),
                            that = this;

                        if (parsedValue.isInt() && parsedValue >= 0) {

                            if (parsedValue > this.MAX_UPDATE_INTERVAL) {
                                throw new Error("Rss Readers 'updateInterval' cannot be higher than " + this.MAX_UPDATE_INTERVAL);
                            }

                            // Store update interval value
                            _updateInterval = parsedValue;

                            // Calculate minutes in ms
                            parsedValue = parsedValue * 1000 * 60;

                            // Try to clear old interval
                            if (this.updateIntervalID) {
                                window.clearInterval(this.updateIntervalID);
                            }

                            // Set interval and store ID
                            this.updateIntervalID = window.setInterval(function () {
                                that.update();
                            }, parsedValue);

                        } else {
                            throw new Error("Rss Readers 'updateInterval' property must be an positive int.");
                        }
                    }
                },
                "updateIntervalID": {
                    get: function () { return _updateIntervalID || false; },

                    set: function (value) {

                        if (value.isInt() && value >= 0) {

                            _updateIntervalID = value;

                        } else {
                            throw new Error("Rss Readers 'updateIntervalID' property must be an int.");
                        }
                    }
                },
                "MAX_UPDATE_INTERVAL": {
                    get: function () { return _MAX_UPDATE_INTERVAL; }
                },
                "AVAILABLE_RSS_SOURCES": {
                    get: function () { return _AVAILABLE_RSS_SOURCES; }
                },
                "REMOTE_PROXY_URL": {
                    get: function () { return _REMOTE_PROXY_URL; }
                }
            });

            // Init values
            this.appContainerObj = appContainerObj;
            this.rssFeedSourceURL = encodeURI(this.AVAILABLE_RSS_SOURCES[0].src);
            this.updateInterval = 1;

            // Private methods
            // Main app method
            this.run = function () {
                var that = this;

                // Add contextMenu
                this.appContainerObj.contextMenuObj.addMenuContent(this.defineContextMenuSettings());

                // Update RRS feed
                this.update();

                // Make sure interval is stopped when application is closed
                this.appContainerObj.onClose = function () {
                    window.clearInterval(that.updateIntervalID);
                };
            };


        };

        PWD.Desktop.AppContainer.RssReader.prototype = {
            constructor: PWD.Desktop.AppContainer.RssReader,

            // Update Rss feed.
            update: function () {
                var that = this;

                // Set loading image in app.
                this.appContainerObj.renderAsLoading();

                // Fetch remote data and fill imagesDataArray, done in private.
                this.appContainerObj.desktopObj.ajaxCall("GET", this.REMOTE_PROXY_URL + this.rssFeedSourceURL, function (httpRequest) {
                    that.handleAjaxResponse(httpRequest);
                });
            },

            handleAjaxResponse: function (httpRequest) {

                // When request is completed
                if (httpRequest.readyState === 4 && httpRequest.responseText.length > 0) {

                    // If the HTTP result code was "Bad request"
                    if (httpRequest.status === 400) {
                        throw new Error('RssReader: Ajax request returned 400 Bad Request');
                    }
                    // If the HTTP result code was "Not found"
                    if (httpRequest.status === 404) {
                        throw new Error('RssReader: Ajax request returned 404 Not Found');
                    }
                    // If the HTTP result code was successful
                    if (httpRequest.status === 200) {

                        // Render RSS flow
                        this.renderRssFlow(httpRequest.responseText);

                    } else {
                        throw new Error('RssReader: There was a problem with the ajax request.');
                    }
                }
            },

            renderRssFlow: function (content) {
                var dateNow,
                    minutes,
                    hours,
                    seconds;

                dateNow = new Date();
                minutes = ('0' + dateNow.getMinutes()).slice(-2);
                hours = ('0' + dateNow.getHours()).slice(-2);
                seconds = ('0' + dateNow.getSeconds()).slice(-2);

                // Render content
                this.appContainerObj.contentElement.innerHTML = content;

                // Render statusbar text
                this.appContainerObj.statusBarText = "Senast uppdaterad: " + hours + ":" + minutes + ":" + seconds;
            },

            defineContextMenuSettings: function () {
                var that = this,
                    contextMenuInfoObj;

                // Setup settings for this appContainers contextMenu.
                contextMenuInfoObj = {
                    "Inställningar": {
                        "Uppdateringsintervall": function () {
                            that.popupUpdateIntervalOptions();

                        },
                        "Välj källa": function () {
                            that.popupSelectSourceOptions();
                        },
                        "Uppdatera nu": function () {that.update(); }
                    }
                };

                return contextMenuInfoObj;
            },

            popupUpdateIntervalOptions: function () {
                var updateIntervalContent,
                    popup;

                // Get content for Update Interval popup
                updateIntervalContent = this.createUpdateIntervalPopupContent();
                popup = new Popup(this.appContainerObj, "Välj uppdateringsintervall", updateIntervalContent);

            },

            popupSelectSourceOptions: function () {
                var selectSourceContent,
                    popup;

                // GET content for Select Source popup
                selectSourceContent = this.createSelectSourcePopupContent();
                popup = new Popup(this.appContainerObj, "Välj källa", selectSourceContent);
            },

            createUpdateIntervalPopupContent: function () {

                var containerElement,
                    selectElement,
                    optionElement,
                    i,
                    that = this;

                // Create container element
                containerElement = document.createElement("div");

                containerElement.innerHTML = "Uppdatera flödet: ";

                // Create select element
                selectElement = document.createElement("select");

                // Create option elements
                for (i = 1; i <= this.MAX_UPDATE_INTERVAL; i++) {
                    optionElement = document.createElement("option");
                    optionElement.setAttribute("value", i);

                    // Different option text formatting depending on value
                    if (i === 1) {
                        optionElement.innerHTML = "Varje minut";
                    } else if (i === 2) {
                        optionElement.innerHTML = "Varannan minut";
                    } else {
                        optionElement.innerHTML = "Var " + i + ":e minut";
                    }

                    // Check if this option should be selected
                    if (this.updateInterval === i) {
                        optionElement.setAttribute("selected", "selected");
                    }

                    // Add option to select
                    selectElement.appendChild(optionElement);

                }

                // Action on select change
                selectElement.addEventListener("change", function () {
                    that.updateInterval = this.value;
                    that.appContainerObj.statusBarText = "Flödet uppdateras nu: " + selectElement.options[selectElement.selectedIndex].innerText;
                    that.appContainerObj.closePopups();
                });

                // Add select to container element
                containerElement.appendChild(selectElement);

                // Return containerElement
                return containerElement;
            },

            createSelectSourcePopupContent: function () {
                var containerElement,
                    radioElement,
                    i,
                    submitElement,
                    inputElement,
                    textElement,
                    that = this;

                // Create container element
                containerElement = document.createElement("div");

                // this.rssFeedSourceURL = encodeURI(this.AVAILABLE_RSS_SOURCES[0]);

                // Create radiobuttons
                for (i = 0; i < this.AVAILABLE_RSS_SOURCES.length; i++) {
                    // Radiobutton
                    radioElement = document.createElement("input");
                    radioElement.setAttribute("type", "radio");
                    radioElement.setAttribute("name", "rss-source");
                    radioElement.setAttribute("value", this.AVAILABLE_RSS_SOURCES[i].src);

                    if (this.rssFeedSourceURL === this.AVAILABLE_RSS_SOURCES[i].src) {
                        radioElement.checked = true;
                    }

                    containerElement.appendChild(radioElement);

                    // Text after button
                    textElement = document.createElement("span");
                    textElement.innerHTML = this.AVAILABLE_RSS_SOURCES[i].name + "<br>";
                    containerElement.appendChild(textElement);
                }

                // Add another option for user input
                radioElement = document.createElement("input");
                radioElement.setAttribute("value", "custom");
                radioElement.setAttribute("type", "radio");
                radioElement.setAttribute("name", "rss-source");
                radioElement.addEventListener("mousedown", function () {
                    inputElement.classList.remove("hidden");
                });
                containerElement.appendChild(radioElement);

                textElement = document.createElement("span");
                textElement.innerHTML = "Egen källa<br>";
                containerElement.appendChild(textElement);

                // Create input element
                inputElement = document.createElement("input");
                inputElement.setAttribute("type", "text");
                inputElement.classList.add("hidden");
                containerElement.appendChild(inputElement);

                // Create submit element
                submitElement = document.createElement("button");
                submitElement.innerHTML = "Verkställ";
                submitElement.classList.add("submitbutton");
                containerElement.appendChild(submitElement);

                // Action on submit
                submitElement.addEventListener("click", function () {
                    that.appContainerObj.closePopups();

                    // Get checked radiobutton
                    radioElement = containerElement.querySelector('input[name = "rss-source"]:checked');

                    // If custom source is selected
                    if (radioElement.getAttribute("value") === "custom") {
                        that.rssFeedSourceURL = inputElement.value;
                    } else {
                        that.rssFeedSourceURL = radioElement.value;
                    }

                    // Update Rss reader
                    that.update();
                });

                // Return containerElement
                return containerElement;
            }
        };

        return PWD.Desktop.AppContainer.RssReader;

    }());

});