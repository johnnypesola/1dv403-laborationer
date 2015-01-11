/**
 * Created by Johnny on 2015-01-05.
 */


"use strict";

define(["mustache", "app/extensions"], function (Mustache) {

    return (function () {

        // Set up namespace
        var PWD = PWD || {};
        PWD.Desktop = PWD.Desktop || {};
        PWD.Desktop.AppContainer = PWD.Desktop.AppContainer || {};

        // Declare ImageManager
        PWD.Desktop.AppContainer.ImageManager = function (appContainerObj) {


            var _REMOTE_SOURCE_URL = "http://homepage.lnu.se/staff/tstjo/labbyServer/imgviewer/",
                _appContainerObj,
                _imagesDataArray;

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
                            throw new Error("ImageManagers 'appContainerObj' property must be an object");
                        }
                    }
                },

                "imagesDataArray": {
                    get: function () {
                        return _imagesDataArray || "";
                    },

                    set: function (array) {
                        if (array !== null && array instanceof Array) {

                            // Only allow to be set once.
                            if (_imagesDataArray) {
                                throw new Error("ImageManagers 'imagesDataArray' can only be set once.");
                            }

                            _imagesDataArray = array;

                        } else {
                            throw new Error("ImageManagers 'imagesDataArray' property must be an array");
                        }
                    }
                }
            });

        // Init values
            this.appContainerObj = appContainerObj;

        // Main app method
            this.run = function () {
                var that = this;
                // Fetch remote data and fill imagesDataArray, done in private.
                this.appContainerObj.desktopObj.ajaxCall("GET", _REMOTE_SOURCE_URL, function (httpRequest) {

                    that.handleAjaxResponse(httpRequest);
                });
            };
        };

        PWD.Desktop.AppContainer.ImageManager.prototype = {
            constructor: PWD.Desktop.AppContainer.ImageManager,

            handleAjaxResponse: function (httpRequest) {

                // When request is completed
                if (httpRequest.readyState === 4 && httpRequest.responseText.length > 0) {

                    // If the HTTP result code was "Bad request"
                    if (httpRequest.status === 400) {
                        throw new Error('Image manager: Ajax request returned 400 Bad Request');
                    }
                    // If the HTTP result code was "Not found"
                    if (httpRequest.status === 404) {
                        throw new Error('Image manager: Ajax request returned 404 Not Found');
                    }
                    // If the HTTP result code was successful
                    if (httpRequest.status === 200) {

                        // Parse and store image data.
                        this.imagesDataArray = JSON.parse(httpRequest.responseText);

                        // Render Thumbnails
                        this.renderThumbnails();

                    } else {
                        throw new Error('Image manager: There was a problem with the ajax request.');
                    }
                }
            },

            renderThumbnails: function () {

                var maxThumbnailSize,
                    thumbnailElement,
                    containerElement,
                    i;

                // Get max thumbnail size
                maxThumbnailSize = this.getMaxThumbnailSize();

                // Clear container content
                this.appContainerObj.clearContent();

                for (i = 0; i < this.imagesDataArray.length; i++) {

                    // Create container
                    containerElement = document.createElement("div");
                    containerElement.classList.add("thumbnail");
                    containerElement.style.minWidth = maxThumbnailSize.width + "px";
                    containerElement.style.minHeight = maxThumbnailSize.height + "px";
                    containerElement.style.lineHeight = maxThumbnailSize.height + "px";

                    // Create thumbnail
                    thumbnailElement = document.createElement("img");
                    thumbnailElement.setAttribute("src", this.imagesDataArray[i].thumbURL);

                    containerElement.appendChild(thumbnailElement);
                    this.appContainerObj.contentElement.appendChild(containerElement);
                }

                this.addThumbnailEvents();

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


        return PWD.Desktop.AppContainer.ImageManager;

    }());

});