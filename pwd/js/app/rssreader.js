/**
 * Created by Johnny on 2015-01-06.
 */


"use strict";

define(["mustache", "app/popup", "app/extensions"], function (Mustache, Popup) {

    return (function () {

        var RssReader = function (appContainerObj) {


            var _REMOTE_PROXY_URL = "http://homepage.lnu.se/staff/tstjo/labbyServer/rssproxy/?url=",
                _rssFeedSourceURL,
                _rssDataArray,
                _appContainerObj,
                _updateInterval;

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
                        var parsedValue = parseFloat(value);
                        if (parsedValue.isInt() && parsedValue >= 0) {
                            var that = this;

                            // Calculate minutes in ms
                            parsedValue = parsedValue * 1000 * 60;

                            _updateInterval = window.setInterval(function () {
                                that.update();
                            }, parsedValue);

                        } else {
                            throw new Error("Rss Readers 'updateInterval' property must be an positive int.");
                        }
                    }
                }
            });

        // Init values
            this.appContainerObj = appContainerObj;
            this.rssFeedSourceURL = encodeURI("http://www.dn.se/m/rss/senaste-nytt");
            this.updateInterval = 1;

        // Private methods
            // Main app method
            this.run = function () {
                var that = this,
                    contextMenuInfoObj;

                var myPopup = new Popup(this.appContainerObj, "Hello", document.createElement("div"));

                // Setup settings for this appContainers contextMenu.
                contextMenuInfoObj = {
                    "Inställningar": {
                        "Uppdateringsintervall": function () {
//                            var temp = Popup(that.appContainerObj, "form", '<input type="text">');
                        },
                        "Välj källa": function () {console.log(2); },
                        "Uppdatera nu": function () {that.update(); }
                    }
                };

                // Add contextMenu and return element references.
                this.appContainerObj.contextMenuObj.addMenuContent(contextMenuInfoObj);

                // Update RRS feed
                this.update();

                // Make sure interval is cleared when application is closed
                this.appContainerObj.onClose = function () {
                    window.clearInterval(that.updateInterval);
                };
            };

            // Update Rss feed.
            this.update = function () {
                var that = this;

                // Fetch remote data and fill imagesDataArray, done in private.
                this.appContainerObj.desktopObj.ajaxCall("GET", _REMOTE_PROXY_URL + this.rssFeedSourceURL, function (httpRequest) {
                    that.handleAjaxResponse(httpRequest);
                });
            };
        };

        RssReader.prototype = {
            constructor: RssReader,

            fetchRssFeed: function (RssFeedSourceURL) {

            },

            handleAjaxResponse: function (httpRequest) {

                // When request is completed
                if (httpRequest.readyState === 4 && httpRequest.responseText.length > 0) {

                    // If the HTTP result code was "Bad request"
                    if (httpRequest.status === 400) {
                        throw new Error('RssReader: Ajax request returned 400 Bad Request');
                    }
                    // If the HTTP result code was "Not found"
                    else if (httpRequest.status === 404) {
                        throw new Error('RssReader: Ajax request returned 404 Not Found');
                    }
                    // If the HTTP result code was successful
                    else if (httpRequest.status === 200) {

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
                this.appContainerObj.statusBarText = "Last updated: " + hours + ":" + minutes + ":" + seconds;
            },

            addThumbnailEvents: function () {
                var i,
                    thumbnails;

                thumbnails = this.appContainerObj.contentElement.querySelectorAll(".thumbnail");

                // Loop through all thumbnails
                for (i = 0; i < thumbnails.length; i++) {

                    this.addThumbnailEvent(thumbnails[i], i);
                }

            },

            addThumbnailEvent: function (thumbnail, index) {
                var that = this;

                // Add click event to thumbnail element
                thumbnail.addEventListener("click", function () {

                    // Popup a window
                    that.appContainerObj.desktopObj.startApp(
                        {
                            name: "Image Manager (Popup)",
                            cssClass: "image-manager",
                            icon: "img/icon/image_manager.svg",
                            width: that.imagesDataArray[index].width + 40,
                            height: that.imagesDataArray[index].height + 70,
                            isResizable: false,
                            hasStatusBar: true,
                            statusBarText: that.imagesDataArray[index].URL
                        },
                        '<img src="' + that.imagesDataArray[index].URL + '">'
                    );
                });
            },

            getMaxThumbnailSize: function () {
                var i,
                    maxSize = {width: 0, height: 0};

                for (i = 0; i < this.imagesDataArray.length; i++) {
                    if (maxSize.width < this.imagesDataArray[i].thumbWidth) {
                        maxSize.width = this.imagesDataArray[i].thumbWidth;
                    }
                    if (maxSize.height < this.imagesDataArray[i].thumbHeight) {
                        maxSize.height = this.imagesDataArray[i].thumbHeight;
                    }
                }

                return maxSize;
            }
        };

        return RssReader;

    }());

});