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
                _messagesArray = [],
                _updateInterval,
                _updateIntervalID,
                _MAX_UPDATE_INTERVAL = 600,
                _MIN_UPDATE_INTERVAL = 10;

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
                },
                "updateInterval": {
                    get: function () { return _updateInterval || ""; },

                    set: function (value) {
                        var parsedValue = parseFloat(value),
                            that = this;

                        if (parsedValue.isInt() && parsedValue >= 0) {

                            if (parsedValue > this.MAX_UPDATE_INTERVAL) {
                                throw new Error("MessageBoards 'updateInterval' cannot be higher than " + this.MAX_UPDATE_INTERVAL);
                            }

                            // Store update interval value
                            _updateInterval = parsedValue;

                            // Calculate minutes in ms
                            parsedValue = parsedValue * 1000;

                            // Try to clear old interval
                            if (this.updateIntervalID) {
                                window.clearInterval(this.updateIntervalID);
                                console.log("cleared");
                            }

                            // Set interval and store ID
                            this.updateIntervalID = window.setInterval(function () {
                                that.getMessages();
                            }, parsedValue);

                        } else {
                            throw new Error("MessageBoards 'updateInterval' property must be an positive int.");
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
                "MIN_UPDATE_INTERVAL": {
                    get: function () { return _MIN_UPDATE_INTERVAL; }
                }
            });

        // Init values
            this.appContainerObj = appContainerObj;
            this.parentContainer = this.appContainerObj.contentElement;
            this.messagesToGet = 20;
            this.updateInterval = 60;

        // Main app method
            this.run = function () {
                var that = this;

                // Add contextMenu
                this.appContainerObj.contextMenuObj.addMenuContent(this.defineContextMenuSettings());

                // Fetch messages from server
                this.getMessages();

                // Make sure interval is stopped when application is closed
                this.appContainerObj.onClose = function () {
                    window.clearInterval(that.updateIntervalID);
                };
            };
        };

        /* Prototype methods, replace prototype with custom object with methods */

        MessageBoard.prototype = {
            constructor: MessageBoard, // Reestablish constructor pointer

            defineContextMenuSettings: function () {
                var that = this,
                    contextMenuInfoObj;

                // Setup settings for this appContainers contextMenu.
                contextMenuInfoObj = {
                    "Inställningar": {
                        "Uppdateringsintervall": function () {
                            that.popupUpdateIntervalOptions();

                        },
                        "Antal meddelanden": function () {
                            that.popupSelectSourceOptions();
                        },
                        "Alias": function () {
                            that.popupSelectSourceOptions();
                        },
                        "Uppdatera nu": function () {that.getMessages(); }
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

            createUpdateIntervalPopupContent: function () {

                var containerElement,
                    selectElement,
                    optionElement,
                    displayedValue,
                    i,
                    that = this;

                // Create container element
                containerElement = document.createElement("div");

                containerElement.innerHTML = "Uppdatera flödet: "

                // Create select element
                selectElement = document.createElement("select");

                // Create option elements
                i = 0;
                do {
                    if (i >= 60) {
                        // Increase value with 60 after 60.
                        i += 60;

                        // Different option text formatting depending on value
                        if (i === 60) {
                            displayedValue = "Varje minut";
                        } else if (i === 120) {
                            displayedValue = "Varannan minut";
                        } else {
                            displayedValue = "Var " + (i / 60) + ":e minut";
                        }
                    } else {
                        // Increase by 10
                        i += this.MIN_UPDATE_INTERVAL;
                        displayedValue = "Var " + i + ":e sekund";
                    }

                    optionElement = document.createElement("option");
                    optionElement.setAttribute("value", i);

                    optionElement.innerHTML = displayedValue;

                    // Check if this option should be selected
                    if (this.updateInterval === i) {
                        optionElement.setAttribute("selected", "selected");
                    }

                    // Add option to select
                    selectElement.appendChild(optionElement);

                } while (i <= this.MAX_UPDATE_INTERVAL);

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

            getMessages: function () {
                var that = this;

                // Remove old messages
                this.messagesArray = [];

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
                    time = element.querySelector("time").innerHTML;

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
                this.submitMsgButton.appendChild(document.createTextNode("Posta"));

                // Counter
                counterParent = document.createElement("div");
                counterParentText = document.createTextNode("Antal meddelanden: ");
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
                    dateObj,
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
                time = document.createElement("span");
                flap = document.createElement("div");

                // Format time
                dateObj = new Date( parseInt(msgObj.time,10));

                // Create content

                timeContent = document.createTextNode(dateObj.getFullYear() + "-"
                    + (dateObj.getMonth() + 1) + "-"
                    + dateObj.getDate() + " ("
                    + dateObj.getHoursMinutesSeconds() + ")"
                );

                textContent = msgObj.text;
                authorContent = msgObj.author;

                // Set classes
                author.classList.add("author");
                time.classList.add("time");
                flap.classList.add("flap");

                if (isNew) {
                    article.classList.add("message-animation");
                }

                // Append elements
                time.appendChild(timeContent);
                text.innerHTML = textContent;
                author.innerHTML = authorContent;

                article.appendChild(text);
                article.appendChild(time);
                article.appendChild(flap);
                article.appendChild(author);

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

                // Update Message count
                this.updateCount(this.messagesArray.length);

                // Scroll to the bottom
                this.parentContainer.scrollTop = this.parentContainer.scrollHeight;

                // Set last uppdated status text.
                this.appContainerObj.statusBarText = "Senast uppdaterad: " + new Date().getHoursMinutesSeconds();

            }
        };

        return MessageBoard;

    }());

});