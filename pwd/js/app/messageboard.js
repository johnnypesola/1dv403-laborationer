"use strict"


define(["mustache", "app/popup", "app/extensions"], function (Mustache, Popup) {

    return (function () {

        var MessageBoard = function (appContainerObj) {

            var _appContainerObj,
                _parentContainer,
                _msgContainer,
                _newMsgContainer,
                _msgCountContainer,
                _submitMsgButton;
            this._messages = [];

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
                "parentContainer": {
                    get: function () {
                        return _parentContainer || "";
                    },

                    set: function (element) {
                        if (element !== null && element.nodeName !== "undefined") {
                            _parentContainer = element;
                        } else {
                            throw new Error("ERROR: MessageBoard:s container must be an element");
                        }
                    }
                },
                "msgContainer": {
                    get: function () {
                        return _msgContainer || "";
                    },

                    set: function (element) {
                        if (element !== null && element.nodeName !== "undefined") {
                            _msgContainer = element;
                        } else {
                            throw new Error("ERROR: msgContainer must be an element");
                        }
                    }
                },
                "newMsgContainer": {
                    get: function () {
                        return _newMsgContainer || "";
                    },

                    set: function (element) {
                        if (element !== null && typeof(element.nodeName) !== "undefined" && element.nodeName.toLowerCase() === "textarea") {
                            _newMsgContainer = element;
                        }
                        else {
                            throw new Error("ERROR: newMsgContainer property can only contain an textarea element");
                        }
                    }
                },
                "msgCountContainer": {
                    get: function () {
                        return _msgCountContainer || "";
                    },

                    set: function (element) {
                        if (element !== null && typeof(element.nodeName) !== "undefined") {
                            _msgCountContainer = element;
                        } else {
                            throw new Error("ERROR: msgCountContainer must be an element");
                        }
                    }
                },
                "submitMsgButton": {
                    get: function () {
                        return _submitMsgButton || "";
                    },
                    set: function (element) {
                        if (element.nodeName !== "undefined" && element.nodeName.toLowerCase() === "button") {
                            _submitMsgButton = element;
                        } else {
                            throw new Error("ERROR: submitMsgButton property can only contain an button element");
                        }
                    }
                }
            });

        // Init values
            this.appContainerObj = appContainerObj;
            this.parentContainer = this.appContainerObj.contentElement;


        // Main app method
            this.run = function () {

                var that = this;

                // Clear content in AppContainer
                this.appContainerObj.clearContent();

                this.createElements();

                // Event listener: Add message on submit button press
                this.submitMsgButton.onclick = function () {
                    that.addMessage();
                };

                // Event listener: Add message on enter key press
                this.addEnterListener();
            };
        };

        /* Prototype methods, replace prototype with custom object with methods */

        MessageBoard.prototype = {
            constructor: MessageBoard, // Reestablish constructor pointer

            addMessage: function () {
                var that = this;

                require(["app/message"], function (Message) {

                    // Create new message and push to container array
                    that._messages.push(new Message(that.newMsgContainer.value));

                    // Print out added message
                    that.renderMessage(that._messages.length - 1, true);

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

            removeMessage: function (index) {
                if (confirm("Are you sure you want to remove this message?")) {
                    this._messages.splice(index, 1);
                    this.renderMessages();
                    this.updateCount();
                }
            },

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

                countText = document.createTextNode(this._messages.length);

                this.removeChildren(this.msgCountContainer);

                this.msgCountContainer.appendChild(countText);
            },

            renderMessage: function (index, isNew) {

                var msg,
                    article,
                    text,
                    time,
                    flap,
                    close,
                    timeContent,
                    textContent,
                    that;

                msg = this._messages[index];
                that = this;

                // Create elements
                article = document.createElement("article");
                text = document.createElement("p");
                time = document.createElement("a");
                flap = document.createElement("div");
                close = document.createElement("a");

                // Create content
                timeContent = document.createTextNode(msg.date.getHoursMinutesSeconds());
                textContent = msg.getHTMLText();

                // Set classes
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
                for (index = 0; index < this._messages.length; index++) {
                    this.renderMessage(index, false);
                }
            }
        };

        return MessageBoard;

    }());

});