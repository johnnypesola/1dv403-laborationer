"use strict"


define(["mustache", "popup", "app/extensions"], function (Mustache, Popup) {

    return (function () {

        // Set up namespace
        var PWD = PWD || {};
        PWD.Desktop = PWD.Desktop || {};
        PWD.Desktop.AppContainer = PWD.Desktop.AppContainer || {};

        // Declare MemoryBoard
        PWD.Desktop.AppContainer.MemoryBoard = function (appContainerObj) {

            var _appContainerObj,
                _rows,
                _columns,
                _cardPairs,
                _userGuessCount,
                _cardTemplateArray,
                _cardsLocked,
                _CARDS_OPEN_TIME = 1000, // In miliseconds
                _CARDS_FLIP_DURATION = 800, // In miliseconds
                _MAX_CARDS_OPEN = 2,
                _cardObjArray = [];

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
                            throw new Error("MemoryBoards 'appContainerObj' property must be an object");
                        }
                    }
                },
                "userGuessCount": {
                    get: function () { return _userGuessCount; },
                    set: function (value) {
                        var parsedValue = parseFloat(value);

                        if (!parsedValue.isInt() || parsedValue < 0) {
                            throw new Error("MemoryBoards 'userGuessCount' property must be an integer and at least 0");
                        }

                        _userGuessCount = value;
                    }
                },
                "rows": {
                    get: function () { return _rows; },
                    set: function (value) {
                        var parsedValue = parseFloat(value);
                        if (!parsedValue.isInt() || parsedValue < 1) {
                            throw new Error("MemoryBoards 'rows' property must be an integer and at least 1");
                        }

                        _rows = value;
                    }
                }, // Not used right now
                "columns": {
                    get: function () { return _columns; },
                    set: function (value) {
                        var parsedValue = parseFloat(value);
                        if (!parsedValue.isInt() || parsedValue < 1) {
                            throw new Error("MemoryBoards 'columns' property must be an integer and at least 1");
                        }

                        _columns = value;
                    }
                }, // Not used right now
                "cardPairs": {
                    get: function () { return _cardPairs; },
                    set: function (value) {
                        var parsedValue = parseFloat(value);
                        if (!parsedValue.isInt() || parsedValue < 1) {
                            throw new Error("MemoryBoards 'cardPairs' property must be an integer and at least 1");
                        }

                        _cardPairs = parsedValue;
                    }
                },
                "cardsOpenNum": {
                    get: function () {
                        var count;

                        count = 0;

                        this.cardObjArray.forEach(function (card) {
                            count += (card.isCardOpen ? 1 : 0);
                        });

                        return count;
                    }
                },
                "cardTemplateArray": {
                    get: function () { return _cardTemplateArray; },
                    set: function (value) {
                        if (!(value instanceof Array)) {
                            throw new Error("MemoryBoards 'cardTemplateArray' property must be an Array.");
                        }

                        _cardTemplateArray = value;
                    }
                },
                "cardObjArray": {
                    get: function () { return _cardObjArray; },
                    set: function (value) {
                        if (!(value instanceof Array)) {
                            throw new Error("MemoryBoards 'cardObjArray' property must be an Array.");
                        }
                        _cardObjArray = value;
                    }
                },
                "cardsMatchedNum": {
                    get: function () {
                        var count;

                        count = 0;

                        this.cardObjArray.forEach(function (card) {
                            count += (card.isMatchFound ? 1 : 0);
                        });

                        return count;
                    }
                },
                "cardsLocked": {
                    get: function () {return _cardsLocked; },
                    set: function (value) {
                        if (typeof value !== "boolean") {
                            throw new Error("MemoryBoards 'cardsLocked' property must be a boolean type.");
                        }

                        _cardsLocked = value;
                    }
                },
                "CARDS_OPEN_TIME": {
                    get: function () { return _CARDS_OPEN_TIME; }
                },
                "CARDS_FLIP_DURATION": {
                    get: function () { return _CARDS_FLIP_DURATION; }
                },
                "MAX_CARDS_OPEN": {
                    get: function () { return _MAX_CARDS_OPEN; }
                },
                "MAX_CARD_PAIRS": {
                    get: function () {
                        if (this.cardObjArray.length > 0) {
                            return this.cardObjArray[0].titleArray.length;
                        }
                        throw new Error("MemoryBoard, cannot get MAX_CARD_PAIRS at this time. cardObjArray is empty.");
                    }
                }
            });

        // Assign constructors default values to properties
            this.appContainerObj = appContainerObj;
            this.rows = 1; // Not used right now.
            this.columns = 6; // Not used right now.
            this.cardPairs = 3;
            this.userGuessCount = 0;
            this.cardsLocked = false;

        // Main app method
            this.run = function () {
                var contextMenuInfoObj;

                // Clear container content
                this.appContainerObj.clearContent();

                // Check that there is an even number of total cards.
                /*
                if (this.rows * this.columns % 2 !== 0) {
                    throw new Error("ERROR: Total number of cards is not even (" + this.rows + " rows * " + this.columns + " columns = " + this.rows * this.columns + " cards)");
                }
                */
                // Generate array to fill with cards
                this.cardTemplateArray = this.getPictureArray(this.cardPairs * 2);

                // Create cards from template array
                this.createCards(this.cardTemplateArray);

                // Setup settings for this appContainers contextMenu.
                contextMenuInfoObj = this.defineContextMenuSettings();

                // Add contextMenu and return element references.
                this.appContainerObj.contextMenuObj.addMenuContent(contextMenuInfoObj);

            };
        };

        PWD.Desktop.AppContainer.MemoryBoard.prototype = {

            constructor: PWD.Desktop.AppContainer.MemoryBoard,

            defineContextMenuSettings: function () {
                var that = this,
                    contextMenuInfoObj;

                // Setup settings for this appContainers contextMenu.
                contextMenuInfoObj = {
                    "Spel": {
                        "Nytt spel": function () {
                            that.resetGame();
                        },
                        "Inställningar": function () {
                            that.popupOptions();
                        }
                    }
                };

                return contextMenuInfoObj;
            },

            popupOptions: function () {
                var updateIntervalContent,
                    popup;

                // Get content for Update Interval popup
                updateIntervalContent = this.createOptionsPopupContent();
                popup = new Popup(this.appContainerObj, "Välj antal kortpar", updateIntervalContent);

            },

            createOptionsPopupContent: function () {

                var containerElement,
                    selectElement,
                    optionElement,
                    i,
                    that = this;

                // Create container element
                containerElement = document.createElement("div");

                containerElement.innerHTML = "Antal kortpar: ";

                // Create select element
                selectElement = document.createElement("select");

                // Create option elements
                for (i = 1; i <= this.MAX_CARD_PAIRS; i++) {
                    optionElement = document.createElement("option");
                    optionElement.setAttribute("value", i.toString());

                    optionElement.innerHTML = i + " par";

                    // Check if this option should be selected

                    if (that.cardPairs === i) {
                        optionElement.setAttribute("selected", "selected");
                    }

                    // Add option to select
                    selectElement.appendChild(optionElement);
                }

                // Action on select change
                selectElement.addEventListener("change", function () {
                    that.cardPairs = this.value;
                    that.appContainerObj.closePopups();
                    that.resetGame("Spelet har nu " + selectElement.options[selectElement.selectedIndex].innerText);
                });

                // Add select to container element
                containerElement.appendChild(selectElement);

                // Return containerElement
                return containerElement;
            },

            getPictureArray: function (numberOfImages) {
                var maxImageNumber,
                    i,
                    imgPlace = [],
                    currentImageNumber,
                    imageOneOK,
                    imageTwoOK,
                    randomOne,
                    randomTwo;

                maxImageNumber = numberOfImages / 2;

                // Place pictures in an Array..
                for (i = 0; i < numberOfImages; i++) {
                    imgPlace[i] = 0;
                }

                for (currentImageNumber = 0; currentImageNumber < maxImageNumber; currentImageNumber++) {
                    imageOneOK = false;
                    imageTwoOK = false;

                    do {
                        if (imageOneOK === false) {
                            randomOne = Math.floor((Math.random() * (this.cardPairs * 2))); // var randomOne = Math.floor( (Math.random() * (rows*cols-0) + 0) );

                            if (imgPlace[randomOne] === 0) {
                                imgPlace[randomOne] = currentImageNumber;
                                imageOneOK = true;
                            }
                        }

                        if (imageTwoOK === false) {
                            randomTwo = Math.floor((Math.random() * (this.cardPairs * 2)));

                            if (imgPlace[randomTwo] === 0) {
                                imgPlace[randomTwo] = currentImageNumber;
                                imageTwoOK = true;
                            }
                        }
                    } while (imageOneOK === false || imageTwoOK === false);
                }

                return imgPlace;
            },

            createCards: function (templateArray) {

                var i,
                    that = this;

                // Require Memorycard object.
                require(["app/appcontainer/memoryboard/memorycard/memorycard"], function (MemoryCard) {

                // Generate card for each entry in templateArray
                    for (i = 0; i < templateArray.length; i++) {
                        that.cardObjArray.push(new MemoryCard(templateArray[i]));
                    }

                    // Throw error if sum of rows and columns exceed total card type count
                    if (that.cardObjArray[0].titleArray.length * 2 < that.cardTemplateArray.length) {
                        throw new Error("ERROR: Current total card limit is " + that.cardObjArray[0].titleArray.length * 2 + " due to number of cardtypes available, the sum of rows * colums is " + that.cardTemplateArray.length);
                    }

                    // Render cards to html
                    that.renderCards();

                });
            },

            renderCard: function (cardId) {

                var cardContainer,
                    flipper,
                    front,
                    back,
                    titleContainer,
                    titleTextContainer,
                    that;

                that = this;

            // Game title text container
                titleTextContainer = document.createElement("span");

            // Game container
                titleContainer = document.createElement("div");
                titleContainer.appendChild(titleTextContainer);

            // Front side of the card
                front = document.createElement("div");
                front.classList.add("front");

            // Back side of the card
                back = document.createElement("div");
                back.classList.add("back");
                back.appendChild(titleContainer);

            // Card flipper container, necessary for css card flip animation
                flipper = document.createElement("div");
                flipper.classList.add("flipper");
                flipper.appendChild(front);
                flipper.appendChild(back);

            // Container
                cardContainer = document.createElement("a");
                cardContainer.setAttribute("href", "#");
                cardContainer.classList.add("card-container");
                cardContainer.appendChild(flipper);

                // Add events
                cardContainer.onclick = function (e) {
                    e.preventDefault();
                    that.showCard(this, cardId);
                };

                // If its the beginning of a row, add a class to container
/*                if (cardId % this.cardPairs === 0) {
                    cardContainer.classList.add("new-row");
                }
*/
            // Append to parent container
                this.appContainerObj.contentElement.appendChild(cardContainer);
            },

            renderCards: function () {

                var i;

                for (i = 0; i < this.cardObjArray.length; i++) {
                    this.renderCard(i);
                }
            },

            showCard: function (cardContainer, cardId) {

                var that = this;

                // Open a card if we are under the max amount, and the card isnt allready opened
                if (!this.cardsLocked &&
                        (this.cardsOpenNum - this.cardsMatchedNum) < this.MAX_CARDS_OPEN &&
                        !this.cardObjArray[cardId].isCardOpen) {

                    // Add class which toggles the open animation
                    cardContainer.classList.add("card-open");

                    // Marks the card object as open (in container array)
                    this.cardObjArray[cardId].isCardOpen = true;

                    // Add info to the card
                    this.addCardInfo(cardContainer, cardId);

                    // If match is found for this card
                    if (this.findMatchingCard(cardId)) {

                        // Increase user guess count (only if two cards are open)
                        this.userGuessCount += 1;

                        // Is game finished?
                        if (this.isGameFinished()) {
                            this.appContainerObj.statusBarText = "Bra jobbat! Spelet avklarad på " + this.userGuessCount + " försök.";
                        }
                    }
                }

                // If we have the max amount of open cards
                if (!this.cardsLocked &&
                        (this.cardsOpenNum - this.cardsMatchedNum) === this.MAX_CARDS_OPEN) {

                    // Increase user guess count (only if two cards are open)
                    this.userGuessCount += 1;

                    // Lock cards
                    this.cardsLocked = true;

                    // Show cards for an ammount of time, and then hide all open cards.
                    setTimeout(function () {
                        that.hideCards();
                    }, this.CARDS_OPEN_TIME);
                }
            },

            findMatchingCard: function (cardId) {

                var that  = this,
                    returnValue = false;

                // Check if the card given in the argument is open
                if (this.cardObjArray[cardId].isCardOpen) {

                    // Loop through all cards
                    this.cardObjArray.forEach(function (cardInArray) {

                        // See if the cards are equal, but not the same reference
                        if (cardInArray.isCardOpen &&
                                cardInArray.isEqualTo(that.cardObjArray[cardId]) &&
                                cardInArray !== that.cardObjArray[cardId]) {

                            // Mark both cards that they found a match
                            cardInArray.isMatchFound = true;
                            that.cardObjArray[cardId].isMatchFound = true;

                            returnValue = true;
                        }
                    });
                }

                return returnValue;
            },

            closeCardObjecs: function () {

                this.cardObjArray.forEach(function (cardInArray) {
                    if (!cardInArray.isMatchFound) {
                        cardInArray.isCardOpen = false;
                    }
                });
            },

            hideCards: function () {

                var cardElements,
                    that = this,
                    i;

                // Close all card objects in array which do not have a match
                this.closeCardObjecs();

                // Get all open card elements.
                cardElements = this.appContainerObj.contentElement.querySelectorAll(".card-container");

                // Loop through cards and remove card-open class, make them flip back.
                for (i = 0; i < cardElements.length; ++i) {

                    if (!this.cardObjArray[i].isMatchFound) {
                        cardElements[i].classList.remove("card-open");
                    }
                }

                // Wait for cards to hide and then clear card elements info.
                setTimeout(function () {

                    // Clear card info, prevent cheating
                    that.clearCardsInfo();

                    // No cards visible/open anymore, unlock cards.
                    that.cardsLocked = false;

                }, this.CARDS_FLIP_DURATION / 2);
            },

            addCardInfo: function (cardContainer, cardId) {

                var titleTextNode,
                    titleTextContainer,
                    titleText,
                    className;

                // Fetch card info
                titleText = this.cardObjArray[cardId].getTitle();
                className = this.cardObjArray[cardId].getCssClass();

                // Create game title text and append to span element
                titleTextNode = document.createTextNode(titleText);
                titleTextContainer = cardContainer.querySelector("span");
                titleTextContainer.appendChild(titleTextNode);

                // Add class to titleText parent to add game background image.
                titleTextContainer.parentNode.classList.add(className);
            },

            clearCardsInfo: function () {

                var cardTitleElements,
                    i,
                    cardTitleParent;

                cardTitleElements = this.appContainerObj.contentElement.querySelectorAll("span");

                // Loop through all card titles and remove text and background image
                for (i = 0; i < cardTitleElements.length; ++i) {

                    cardTitleParent = cardTitleElements[i];

                    if (!this.cardObjArray[i].isMatchFound) {
                        // Remove child text nodes, no matter how many.
                        while (cardTitleParent.firstChild) {
                            cardTitleParent.removeChild(cardTitleParent.firstChild);
                        }

                        // Remove css class that has game background image.
                        cardTitleParent.parentNode.removeAttribute("class");
                    }


                }
            },

            isGameFinished: function () {
                var cardsLeft = 0;

                this.cardObjArray.forEach(function (card) {
                    if (!card.isMatchFound) {
                        ++cardsLeft;
                    }
                });

                return cardsLeft === 0;
            },

            resetGame: function (statusText) {

                this.userGuessCount = 0;
                this.cardsLocked = false;
                this.cardObjArray = [];

                this.appContainerObj.statusBarText = statusText || "";

                this.run();

            }
        };

        return PWD.Desktop.AppContainer.MemoryBoard;

    }());

});