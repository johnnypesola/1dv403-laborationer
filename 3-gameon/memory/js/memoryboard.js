"use strict"

/* Constructor function */
    function MemoryBoard(rows, columns, parentContainerId){
        
        var _parentContainer,
            _rows,
            _columns,
            _userGuessCount,
            _cardTemplateArray,
            _CARDS_OPEN_TIME = 1000, // In miliseconds
            _CARDS_FLIP_DURATION = 800, // In miliseconds
            _MAX_CARDS_OPEN = 2;

        this._cards = [];
        this.cardsLocked = false;
        
    // Properties with Getters and Setters
        Object.defineProperties(this, {
            "parentContainer": {
                get: function(){ return this._parentContainer || ""; },
                
                set: function(element){
                    if(element !== null && typeof(element.nodeName) !== "undefined"){
                        this._parentContainer = element;
                    }
                    else{
                        throw new Error("ERROR: MemoryBoard:s parent container must be an element");
                    }
                }
            },
            "userGuessCount": {
                get: function(){ return _userGuessCount },
                
                set: function(value){
                    var parsedValue = parseFloat(value);
                    if(!(!isNaN(parsedValue) && isFinite(parsedValue) && parsedValue >= 0 && parsedValue % 1 === 0 && value == parsedValue)){
                        throw new Error("ERROR: userGuessCount property must be an integer and at least 0");
                    }
                    
                    _userGuessCount = value;
                }
            },
            "rows": {
                get: function(){ return _rows },
                
                set: function(value){
                    var parsedValue = parseFloat(value);
                    if(!(!isNaN(parsedValue) && isFinite(parsedValue) && parsedValue > 0 && parsedValue % 1 === 0 && value == parsedValue)){
                        throw new Error("ERROR: rows property must be an integer and at least 1");
                    }
                    
                    _rows = value;
                }
            },
            "columns": {
                get: function(){ return _columns },
                
                set: function(value){
                    var parsedValue = parseFloat(value);
                    if(!(!isNaN(parsedValue) && isFinite(parsedValue) && parsedValue > 0 && parsedValue % 1 === 0 && value == parsedValue)){
                        throw new Error("ERROR: columns property must be an integer and at least 1");
                    }
                    
                    _columns = value;
                }
            },
            "cardsOpenNum": {
                get: function(){
                    var count;
                    
                    count = 0;
                    
                    this._cards.forEach(function(card){
                        count += (card.isCardOpen ? 1 : 0);
                    });
                    
                    return count;
                }
            },
            "cardsMatchedNum": {
                get: function(){
                    var count;
                    
                    count = 0;
                    
                    this._cards.forEach(function(card){
                        count += (card.isMatchFound ? 1 : 0);
                    });

                    return count;
                }
            },
            "CARDS_OPEN_TIME": {
                get: function(){ return _CARDS_OPEN_TIME }
            },
            "CARDS_FLIP_DURATION": {
                get: function(){ return _CARDS_FLIP_DURATION }
            },
            "MAX_CARDS_OPEN": {
                get: function(){ return _MAX_CARDS_OPEN }
            }
        });
        
    // Assign constructors default values to properties
        this.parentContainer = document.getElementById(parentContainerId);
        this.rows = rows || 2;
        this.columns = columns || 2;
        this.userGuessCount = 0;

    // Main app method
        this.run = function(){
            
            // Check that there is an even number of total cards.
            if(this.rows * this.columns % 2 !== 0){
                throw new Error("ERROR: Total number of cards is not even (" + this.rows + " rows * " + this.columns + " columns = " + this.rows * this.columns + " cards)");
            }
            
            // Generate array to fill with cards
            _cardTemplateArray = this.getPictureArray(rows, columns);
            
            // Create cards from template array
            this.createCards(_cardTemplateArray);
            
            // Throw error if sum of rows and columns exceed total card type count
            if(this._cards[0].titleArray.length * 2 < _cardTemplateArray.length){
                throw new Error("ERROR: Current total card limit is " + this._cards[0].titleArray.length * 2 + " due to number of cardtypes available, the sum of rows * colums is " + _cardTemplateArray.length);
            }
            
            // Render cards to html
            this.renderCards();
        }
    }
    
    MemoryBoard.prototype = {
        constructor:    MemoryBoard,
        
        getPictureArray: function(rows, cols){
    		var numberOfImages = rows*cols;
    		var maxImageNumber = numberOfImages/2;
    	
    	   	var imgPlace = [];
    	
    	    // Place pictures in an Array..
            for(var i=0; i<numberOfImages; i++){
                imgPlace[i] = 0;
            }
    	
    		for(var currentImageNumber=0; currentImageNumber<maxImageNumber; currentImageNumber++)
    		{		
    			var imageOneOK = false;
    			var imageTwoOK = false;
    			
    			do
    			{
    				if(imageOneOK == false)
    				{
    					var randomOne = Math.floor( (Math.random() * (rows*cols-0) + 0) );				
    					
    					if( imgPlace[randomOne] == 0 )
    					{
    						imgPlace[randomOne] = currentImageNumber;
    						imageOneOK = true;
    					}
    				}
    				
    				if(imageTwoOK == false)
    				{
    					var randomTwo = Math.floor( (Math.random() * (rows*cols-0) + 0) );				
    								
    					if( imgPlace[randomTwo] == 0 )
    					{
    						imgPlace[randomTwo] = currentImageNumber;
    						imageTwoOK = true;
    					}
    				}			
    			}
    			while(imageOneOK == false || imageTwoOK == false);		
    		}
    		
    		return imgPlace;
    	},
    	
    	createCards: function(templateArray){
            // Generate card for each entry in _cards array
            var i;
            
            for(i = 0; i < templateArray.length; i++){
                this._cards.push(new MemoryCard(templateArray[i]))
            }
        },
    	
        renderCard: function(cardId){
        
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
                cardContainer.onclick = function(){
                    that.showCard(this, cardId);
                }
                
                // If its the beginning of a row, add a class to container
                if(cardId % this.columns === 0){
                    cardContainer.classList.add("new-row");
                }
                
            // Append to parent container
                this.parentContainer.appendChild(cardContainer);
        },
        
        renderCards: function(){
            var i;
            for(i = 0; i < this._cards.length; i++){
                this.renderCard(i);
            }
        },
        
        showCard: function(cardContainer, cardId){
            
            var that;
            
            that = this;
            
            // Open a card if we are under the max amount, and the card isnt allready opened
            if( !this.cardsLocked &&
                (this.cardsOpenNum - this.cardsMatchedNum) < this.MAX_CARDS_OPEN &&
                !this._cards[cardId].isCardOpen){
                
                // Add class which toggles the open animation
                cardContainer.classList.add("card-open");
                
                // Marks the card object as open (in container array)
                this._cards[cardId].isCardOpen = true;

                // Add info to the card
                this.addCardInfo(cardContainer, cardId);
                
                // If match for this card
                if(this.findMatchingCard(cardId)){
                    
                    // Increase user guess count (only if two cards are open)
                    this.userGuessCount += 1;
                    
                    // Is game finished?
                    if(this.isGameFinished()){
                        alert("Game finished in " + this.userGuessCount + " attempts.");
                    }
                }
            }
            
            // If we have the max amount of open cards
            if( !this.cardsLocked &&
                (this.cardsOpenNum - this.cardsMatchedNum) == this.MAX_CARDS_OPEN){
                
                // Increase user guess count (only if two cards are open)
                this.userGuessCount += 1;
                
                // Lock cards
                this.cardsLocked = true;
                
                // Show cards for an ammount of time, and then hide all open cards.
                setTimeout(function(){
                    that.hideCards();
                }, this.CARDS_OPEN_TIME);
            }
        },
        
        findMatchingCard: function(cardId){
            //this._cards[cardId].isEqual()
            
            var count,
                cardInArray,
                that,
                returnValue;
            
            that = this;
            returnValue = false;

            // Check if the card given in the argument is open
            if(this._cards[cardId].isCardOpen){
                
                // Loop through all cards
                this._cards.forEach(function(cardInArray){
                
                    // See if the cards are equal, but not the same reference
                    if( cardInArray.isCardOpen && 
                        cardInArray.isEqualTo(that._cards[cardId]) &&
                        cardInArray !== that._cards[cardId] ){
                        
                        // Mark both cards that they found a match
                        cardInArray.isMatchFound = true;
                        that._cards[cardId].isMatchFound = true;
                        
                        returnValue = true;
                    }
                });
            }
            
            return returnValue;
        },
        
        closeCards: function(){
            
            this._cards.forEach(function(cardInArray){
                if(!cardInArray.isMatchFound){
                    cardInArray.isCardOpen = false;
                }
            });
        },
        
        hideCards: function(){
            
            var cardElements,
                that,
                i;
            
            that = this;
            
            // Close all card objects in array witch have a match
            this.closeCards();
            
            // Get all open card elements.
            cardElements = this.parentContainer.querySelectorAll(".card-container");
            
            // Loop through cards and remove card-open class, make them flip back.
            for(i = 0; i < cardElements.length; ++i){

                if(!this._cards[i].isMatchFound){
                    cardElements[i].classList.remove("card-open");
                }
            }
            
            // Wait for cards to hide and then clear card elements info.
            setTimeout(function(){
                
                that.clearCardsInfo();
                
                // No cards visible anymore.
                that.cardsLocked = false;
                
            }, this.CARDS_FLIP_DURATION / 2);
        },
        
        addCardInfo: function(cardContainer, cardId){
            
            var titleTextNode,
                titleTextContainer,
                titleText,
                className;
            
            // Fetch card info
            titleText = this._cards[cardId].getTitle();
            className = this._cards[cardId].getCssClass();
            
            // Create game title text and append to span element
            titleTextNode = document.createTextNode(titleText);
            titleTextContainer = cardContainer.querySelector("span");
            titleTextContainer.appendChild(titleTextNode);
            
            // Add class to titleText parent to add game background image.
            titleTextContainer.parentNode.classList.add(className);
        },
        
        clearCardsInfo: function(){
            
            var cardTitleElements,
                i;
            
            cardTitleElements = this.parentContainer.querySelectorAll("span");
            
            // Loop through all card titles and remove text and background image
            for(i = 0; i < cardTitleElements.length; ++i){
                
                var cardTitleParent = cardTitleElements[i];

                if(!this._cards[i].isMatchFound)
                {
                    // Remove child text nodes, no matter how many.
                    while (cardTitleParent.firstChild){
                        cardTitleParent.removeChild(cardTitleParent.firstChild);
                    }
                    
                    // Remove css class that has game background image.    
                    cardTitleParent.parentNode.removeAttribute("class");
                }
                
                
            }
        },
        
        isGameFinished: function(){
            var cardsLeft = 0;
            
            this._cards.forEach(function(card){
                if(!card.isMatchFound){
                    ++cardsLeft;
                }
            });
            
            return cardsLeft === 0;
        }
    };