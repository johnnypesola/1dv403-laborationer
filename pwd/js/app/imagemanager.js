/**
 * Created by Johnny on 2015-01-05.
 */


"use strict";

define(["mustache", "app/extensions"], function (Mustache) {

    return (function () {

        var Constructor = function (appContainerObj) {


            var _REMOTE_SOURCE_URL = "http://homepage.lnu.se/staff/tstjo/labbyServer/imgviewer/",
                _appContainerObj,
                _imagesDataArray,
                _that = this;

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

            // Private init function
            (function () {

                // Fetch remote data and fill imagesDataArray, done in private.
                _that.appContainerObj.desktopObj.ajaxCall("GET", _REMOTE_SOURCE_URL, function (httpRequest) {

                    _that.handleAjaxResponse(httpRequest);
                });
            }());
        };

        Constructor.prototype = {
            constructor: Constructor,

            handleAjaxResponse: function (httpRequest) {

                // When request is completed
                if (httpRequest.readyState === 4 && httpRequest.responseText.length > 0) {

                    // If the HTTP result code was "Bad request", also means wrong answer to question.
                    if (httpRequest.status === 400) {
                        throw new Error('Image manager: Ajax request returned 400 Bad Request');
                    }
                    // If the HTTP result code was "Not found", the question does not exist.
                    else if (httpRequest.status === 404) {
                        throw new Error('Image manager: Ajax request returned 404 Not Found');
                    }
                    // If the HTTP result code was successful, could mean correct answer to question.
                    else if (httpRequest.status === 200) {

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
                    containerElement.style.width = maxThumbnailSize.width + "px";
                    containerElement.style.height = maxThumbnailSize.height + "px";

                    // Create thumbnail
                    thumbnailElement = document.createElement("img");
                    thumbnailElement.setAttribute("src", this.imagesDataArray[i].thumbURL);

                    console.log(thumbnailElement.style.width + "<- " + maxThumbnailSize.width);

                    containerElement.appendChild(thumbnailElement);
                    this.appContainerObj.contentElement.appendChild(containerElement);
                }

//                this.appContainerObj.contentElement.innerHTML = this.imagesDataArray[0].URL;

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


        return Constructor;

    }());

});