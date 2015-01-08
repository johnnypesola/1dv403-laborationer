"use strict"


define(["mustache", "app/popup", "app/extensions"], function (Mustache, Popup) {

    return (function () {

        var MessageBoard = function (appContainerObj) {

            var _WRITE_SERVER_URL = "http://homepage.lnu.se/staff/tstjo/labbyserver/setMessage.php",
                _READ_SERVER_URL = "http://homepage.lnu.se/staff/tstjo/labbyserver/getMessage.php",
                _appContainerObj,
                _parentContainer,
                _msgContainer,
                _newMsgContainer,
                _msgCountContainer,
                _submitMsgButton,
                _messagesToGet,
                _messagesArray = [];

        // Properties with Getters and Setters
            Object.defineProperties(this, {
                "appContainerObj": {
                    get: function () { return _appContainerObj || ""; },
                    set: function (obj) {
                        if (obj !== null && typeof obj === "object") {
                            _appContainerObj = obj;
                        } else {
                            throw new Error("MessageBoards 'appContainerObj' property must be an object");
                        }
                    }
                },
                "parentContainer": {
                    get: function () { return _parentContainer || ""; },
                    set: function (element) {
                        if (element !== null && element.nodeName !== "undefined") {
                            _parentContainer = element;
                        } else {
                            throw new Error("MessageBoards 'parentContainer' must be an element");
                        }
                    }
                },
                "msgContainer": {
                    get: function () { return _msgContainer || ""; },
                    set: function (element) {
                        if (element !== null && element.nodeName !== "undefined") {
                            _msgContainer = element;
                        } else {
                            throw new Error("MessageBoards 'msgContainer' must be an element");
                        }
                    }
                },
                "newMsgContainer": {
                    get: function () { return _newMsgContainer || ""; },
                    set: function (element) {
                        if (element !== null && element.nodeName !== "undefined" && element.nodeName.toLowerCase() === "textarea") {
                            _newMsgContainer = element;
                        } else {
                            throw new Error("MessageBoards 'newMsgContainer' property can only contain an textarea element");
                        }
                    }
                },
                "msgCountContainer": {
                    get: function () { return _msgCountContainer || ""; },
                    set: function (element) {
                        if (element !== null && typeof(element.nodeName) !== "undefined") {
                            _msgCountContainer = element;
                        } else {
                            throw new Error("MessageBoards 'msgCountContainer' must be an element");
                        }
                    }
                },
                "submitMsgButton": {
                    get: function () { return _submitMsgButton || ""; },
                    set: function (element) {
                        if (element.nodeName !== "undefined" && element.nodeName.toLowerCase() === "button") {
                            _submitMsgButton = element;
                        } else {
                            throw new Error("MessageBoards 'submitMsgButton' property can only contain an button element");
                        }
                    }
                },
                "WRITE_SERVER_URL": {
                    get: function () { return _WRITE_SERVER_URL; }
                },
                "READ_SERVER_URL": {
                    get: function () {return _READ_SERVER_URL; }
                },
                "messagesToGet": {
                    get: function () { return _messagesToGet; },
                    set: function (value) {
                        var parsedValue = parseFloat(value);

                        if (!parsedValue.isInt() || parsedValue < 0) {
                            throw new Error("MessageBoards 'messagesToGet' property must be an integer and at least 0");
                        }

                        _messagesToGet = value;
                    }
                },
                "messagesArray": {
                    get: function () { return _messagesArray; },
                    set: function (value) {
                        if (!(value instanceof Array)) {
                            throw new Error("Messageboards 'messagesArray' property must be an Array.");
                        }

                        _messagesArray = value;
                    }
                }
            });

        // Init values
            this.appContainerObj = appContainerObj;
            this.parentContainer = this.appContainerObj.contentElement;
            this.messagesToGet = 20;


        // Main app method
            this.run = function () {
                var that = this;

                // Fetch messages from server
                this.getMessages();

            };
        };

        /* Prototype methods, replace prototype with custom object with methods */

        MessageBoard.prototype = {
            constructor: MessageBoard, // Reestablish constructor pointer

            getMessages: function () {
                var that = this;

                // Fetch remote data and fill imagesDataArray, done in private.
                this.appContainerObj.desktopObj.ajaxCall("GET", this.READ_SERVER_URL + "?history=" + this.messagesToGet, function (httpRequest) {
                    that.handleAjaxResponse(httpRequest);
                });

            },

            handleAjaxResponse: function (httpRequest) {

                // When request is completed
                if (httpRequest.readyState === 4 && httpRequest.responseText.length > 0) {

                    // If the HTTP result code was "Bad request"
                    if (httpRequest.status === 400) {
                        throw new Error('MessageBoard: Ajax request returned 400 Bad Request');
                    }
                    // If the HTTP result code was "Not found"
                    else if (httpRequest.status === 404) {
                        throw new Error('MessageBoard: Ajax request returned 404 Not Found');
                    }
                    // If the HTTP result code was successful
                    else if (httpRequest.status === 200) {
                        var xmlResponse,
                            that = this;

                        // Get response
                        xmlResponse = new DOMParser().parseFromString(httpRequest.responseText, 'text/xml');

                        // Parse response
                        this.parseXmlResponse(xmlResponse);

                        // Clear content in AppContainer
                        this.appContainerObj.clearContent();

                        // Create elements
                        this.createElements();

                        // Render messages
                        this.renderMessages();

                        // Event listener: Add message on submit button press
                        this.submitMsgButton.onclick = function () {
                            that.addMessage();
                        };

                        // Event listener: Add message on enter key press
                        this.addEnterListener();


                    } else {
                        throw new Error('MessageBoard: There was a problem with the ajax request.');
                    }
                }
            },

            parseXmlResponse: function (xmlResponse) {
                var id,
                    text,
                    author,
                    time,
                    messagesNodeList,
                    that = this;

                // Get all messages
                messagesNodeList = xmlResponse.querySelectorAll("message");

                // Loop through messages
                messagesNodeList.forEach(function (element) {

                    // Get all values
                    id = element.querySelector("id").innerHTML;
                    text = element.querySelector("text").innerHTML;
                    author = element.querySelector("author").innerHTML;
                    time = new Date(element.querySelector("time").innerHTML * 1000);

                    // Push values as message-objects to messagesArray
                    that.messagesArray.push({
                        id: id,
                        text: text,
                        author: author,
                        time: time
                    });
                });
            },

            addMessage: function () {
                var that = this;

                require(["app/message"], function (Message) {

                    // Create new message and push to container array
                    //that.messagesArray.push(new Message(that.newMsgContainer.value));

                    // Print out added message
                    that.renderMessage(that.messagesArray.length - 1, true);

                    // Update count
                    that.updateCount();

                    // Empty the textarea
                    that.newMsgContainer.value = '';
                });
            },
            createElements: function () {

                var section,
                    counterParentText,
                    counterParent,
                    counterText,
                    bouble1,
                    bouble2;

                // Message list

                // Container
                this.msgContainer = document.createElement("div");

                // Message form

                // Section parent tag
                section = document.createElement("section");

                // Textarea
                this.newMsgContainer = document.createElement("textarea");

                // Submit button
                this.submitMsgButton = document.createElement("button");
                this.submitMsgButton.appendChild(document.createTextNode("Write"));

                // Counter
                counterParent = document.createElement("div");
                counterParentText = document.createTextNode("Message count: ");
                counterParent.appendChild(counterParentText);

                this.msgCountContainer = document.createElement("span");
                counterText = document.createTextNode("0");
                this.msgCountContainer.appendChild(counterText);

                counterParent.classList.add("message-counter");

                counterParent.appendChild(this.msgCountContainer);

                // Boubles, not really necessary, but for fun.
                bouble1 = document.createElement("div");
                bouble2 = document.createElement("div");
                bouble1.classList.add("big-bouble");
                bouble2.classList.add("small-bouble");

                // Append stuff
                section.appendChild(this.newMsgContainer);
                section.appendChild(this.submitMsgButton);
                section.appendChild(counterParent);
                section.appendChild(bouble1);
                section.appendChild(bouble2);

                this.parentContainer.appendChild(this.msgContainer);
                this.parentContainer.appendChild(section);
            },
            /*
            removeMessage: function (index) {
                if (confirm("Are you sure you want to remove this message?")) {
                    this.messagesArray.splice(index, 1);
                    this.renderMessages();
                    this.updateCount();
                }
            },
*/

            addEnterListener: function () {

                var that;

                that = this;

                this.newMsgContainer.onkeypress = function (e) {

                    // If enter is pressed without shift key.
                    if (!e.shiftKey && e.keyCode === 13) {

                        that.addMessage();

                        // Prevent default new line behaviour (When pressing enter key.)
                        return false;
                    }
                };
            },

            removeChildren: function (parent) {

                if (typeof(parent) !== "undefined") {
                    while (parent.firstChild) {
                        parent.removeChild(parent.firstChild);
                    }
                }
            },

            updateCount: function () {

                var countText;

                countText = document.createTextNode(this.messagesArray.length);

                this.removeChildren(this.msgCountContainer);

                this.msgCountContainer.appendChild(countText);
            },

            renderMessage: function (index, isNew) {

                var msgObj,
                    article,
                    author,
                    text,
                    time,
                    flap,
                    close,
                    timeContent,
                    textContent,
                    authorContent,
                    that;



                msgObj = this.messagesArray[index];
                that = this;

                // author, id, text, time

                // Create elements
                article = document.createElement("article");

                author = document.createElement("span");
                text = document.createElement("p");
                time = document.createElement("a");
                flap = document.createElement("div");
                close = document.createElement("a");


                // Create content
                timeContent = document.createTextNode(msgObj.time.getHoursMinutesSeconds());
                textContent = msgObj.text;
                authorContent = msgObj.author;

                // Set classes
                author.classList.add("author");
                time.classList.add("time");
                flap.classList.add("flap");
                close.classList.add("close");

                // Set href attributes
                time.setAttribute("href", "#");
                close.setAttribute("href", "#");

                if (isNew) {
                    article.classList.add("message-animation");
                }

                // Append elements
                time.appendChild(timeContent);
                text.innerHTML = textContent;

                article.appendChild(text);
                article.appendChild(time);
                article.appendChild(flap);
                article.appendChild(close);

                // Add events
                close.onclick = function (e) {
                    e.preventDefault();
                    that.removeMessage(index);
                };

                time.onclick = function (e) {
                    e.preventDefault();
                    alert("Inlägget skapades " + msg.date.toLocaleString());
                };

                // Add this new message to dom
                this.msgContainer.appendChild(article);

            },

            renderMessages: function () {

                var index;

                // Clear previous messages
                this.removeChildren(this.msgContainer);

                // Add all messages, including new one
                for (index = 0; index < this.messagesArray.length; index++) {
                    this.renderMessage(index, false);
                }
            }
        };

        return MessageBoard;

    }());

});