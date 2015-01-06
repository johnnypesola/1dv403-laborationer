/**
 * Created by Johnny on 2015-01-06.
 */


"use strict";

define(["mustache", "app/extensions"], function (Mustache) {

    return (function () {

        var RssReader = function (appContainerObj) {


            var _REMOTE_PROXY_URL = "http://homepage.lnu.se/staff/tstjo/labbyServer/rssproxy/?url=",
                _rssFeedSourceURL,
                _rssDataArray,
                _appContainerObj;

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
                }
            });

            // Init values
            this.appContainerObj = appContainerObj;
            this.rssFeedSourceURL = encodeURI("http://www.dn.se/m/rss/senaste-nytt");

            // Main app method
            this.run = function () {
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

                this.appContainerObj.contentElement.innerHTML = content;
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