"use strict"

/* Constructor function */
    function MemoryBoard(rows, columns, parentContainerId){
        
        var _parentContainer,
            _cardTemplateArray,
            _number,
            _rows,
            _cardsOpenNum,
            _columns;
        this._cards = [];
        this.CARDS_OPEN_TIME = 1000; // In miliseconds
        this.CARDS_FLIP_DURATION = 800 // In miliseconds
        this.MAX_CARDS_OPEN = 2;
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
            "rows": {
                get: function(){ return this._rows },
                
                set: function(value){
                    var parsedValue = parseFloat(value);
                    if(!(!isNaN(parsedValue) && isFinite(parsedValue) && parsedValue > 0 && parsedValue % 1 === 0 && value == parsedValue)){
                        throw new Error("ERROR: rows property must be an integer and at least 1");
                    }
                    
                    this._rows = value;
                }
            },
            "columns": {
                get: function(){ return this._columns },
                
                set: function(value){
                    var parsedValue = parseFloat(value);
                    if(!(!isNaN(parsedValue) && isFinite(parsedValue) && parsedValue > 0 && parsedValue % 1 === 0 && value == parsedValue)){
                        throw new Error("ERROR: columns property must be an integer and at least 1");
                    }
                    
                    this._columns = value;
                }
            },
            "cardsOpenNum": {
                get: function(){ return this._cardsOpenNum || 0 },
                
                set: function(value){
                    var parsedValue = parseFloat(value);
                    if(!(!isNaN(parsedValue) && isFinite(parsedValue) && parsedValue >= 0 && parsedValue % 1 === 0 && value == parsedValue)){
                        throw new Error("ERROR: cardsOpenNum property must be an integer and at least 0");
                    }
                    
                    this._cardsOpenNum = value;
                }
            }
            
        });
        
    // Assign constructors default values to properties
        this.parentContainer = document.getElementById(parentContainerId);
        this.rows = rows || 2;
        this.columns = columns || 2;
        this.cardsOpenNum = 0;

    // Main app method
        this.run = function(){
            
            // Generate array to fill with cards
            _cardTemplateArray = this.getPictureArray(rows, columns);
            
            // Create cards from template array
            this.createCards(_cardTemplateArray);
            
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
    	
    	   //Utplacering av bilder i Array
    	   for(var i=0; i<numberOfImages; i++)
    		  imgPlace[i] = 0;
    	
    		for(var currentImageNumber=1; currentImageNumber<=maxImageNumber; currentImageNumber++)
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
    	
        renderCard: function(CardId){
        
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
                front = document.createElement("a");
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
                    that.showCard(this, CardId);
                }
                
                // If its the beginning of a row, add a class to container
                if(CardId % this.columns === 0){
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
        
        showCard: function(cardContainer, CardId){
            
            var that;
            
            that = this;

            // Open a card if we are under the max amount
            if(!this.cardsLocked && this.cardsOpenNum < this.MAX_CARDS_OPEN){
                
                // Add class which toggles the open animation
                cardContainer.classList.add("card-open");

                // Add info to the card
                this.addCardInfo(cardContainer, CardId);
                
                // Increase cards open count
                this.cardsOpenNum += 1;
            }
            
            // If we have the max amount of open cards
            if(!this.cardsLocked && this.cardsOpenNum == this.MAX_CARDS_OPEN){
                
                // Lock cards
                this.cardsLocked = true;
                
                // Show cards for an ammount of time, and then hide all open cards.
                setTimeout(function(){
                    that.hideCards();
                }, this.CARDS_OPEN_TIME);
            }
        },
        
        findMatch: function(){
            
        },
        
        hideCards: function(){
            
            var cardElements,
                that,
                i;
            
            that = this;

            // Get all open card elements.
            cardElements = this.parentContainer.querySelectorAll(".card-open");
            
            // Loop through cards and remove card-open class, make them flip back.
            for(i = 0; i < cardElements.length; ++i){
                cardElements[i].classList.remove("card-open");
            }
            
            // Wait for cards to hide and then clear card elements info.
            setTimeout(function(){
                
                that.clearCardsInfo();
                
                // No cards visible anymore.
                that.cardsOpenNum = 0;
                that.cardsLocked = false;
                
            }, this.CARDS_FLIP_DURATION / 2);
        },
        
        addCardInfo: function(cardContainer, CardId){
            
            var titleTextNode,
                titleTextContainer,
                titleText,
                className;
            
            // Fetch card info
            titleText = this._cards[CardId].getTitle();
            className = this._cards[CardId].getCssClass();
            
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
            
            // I cannot get the affected elements 
            cardTitleElements = this.parentContainer.querySelectorAll("span");
            
            // Loop through game titles and remove them
            for(i = 0; i < cardTitleElements.length; ++i){
                
                var cardTitleParent = cardTitleElements[i];

                // Remove child text nodes, no matter how many.
                while (cardTitleParent.firstChild){
                    cardTitleParent.removeChild(cardTitleParent.firstChild);
                }
            
                // Remove css class that has game background image.    
                cardTitleParent.parentNode.removeAttribute("class");
            }
        }
        
    };