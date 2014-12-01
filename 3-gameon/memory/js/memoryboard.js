"use strict"

/* Constructor function */
    function MemoryBoard(rows, columns, parentContainerId){
        
        var _parentContainer,
            _cardTemplateArray,
            _number,
            _rows,
            _cardsVisibleNum,
            _columns;
        this._cards = [];
        this.CARDS_OPEN_TIME = 1000; // In miliseconds
        this.MAX_CARDS_OPEN = 2;
        
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
            "cardsVisibleNum": {
                get: function(){ return this._cardsVisibleNum || 0 },
                
                set: function(value){
                    var parsedValue = parseFloat(value);
                    if(!(!isNaN(parsedValue) && isFinite(parsedValue) && parsedValue >= 0 && parsedValue % 1 === 0 && value == parsedValue)){
                        throw new Error("ERROR: cardsVisibleNum property must be an integer and at least 0");
                    }
                    
                    this._cardsVisibleNum = value;
                }
            }
            
        });
        
    // Assign constructors default values to properties
        this.parentContainer = document.getElementById(parentContainerId);
        this.rows = rows || 2;
        this.columns = columns || 2;
        this.cardsVisibleNum = 0;

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
    	
        renderCard: function(id){
        
            var cardContainer,
                flipper,
                front,
                back,
                titleContainer,
                titleTextContainer,
                titleTextNode,
                that;
                
            that = this;
            
            // Game title text
                titleTextNode = document.createTextNode(this._cards[id].getTitle());
            
            // Game title text container
                titleTextContainer = document.createElement("span");
                titleTextContainer.appendChild(titleTextNode);
            
            // Game container
                titleContainer = document.createElement("div");
                titleContainer.classList.add(this._cards[id].getCssClass());
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
                    that.showCard(this, that);
                }
                
                // If its the beginning of a row, add a class to container
                if(id % this.columns === 0){
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
        
        showCard: function(cardContainer, MemoryBoardObj){
            
            var that;
            
            that = this;
            
            
            if(this.cardsVisibleNum < this.MAX_CARDS_OPEN){
                
                cardContainer.classList.add("card-open");
                this.cardsVisibleNum += 1;
            }
            
            // If we have two open cards
            if(this.cardsVisibleNum >= this.MAX_CARDS_OPEN){
                
                // Show cards for an ammount of time, and then hide all open cards.
                setTimeout(function(){
                    that.hideCards();
                }, this.CARDS_OPEN_TIME);
            }
        },
        
        hideCards: function(){
            
            var cardElements,
                i;
            
            // Get all open card elements
            cardElements = this.parentContainer.querySelectorAll(".card-open");
            
            // Loop through cards and remove card-open class
            for(i = 0; i < cardElements.length; ++i){
                cardElements[i].classList.remove("card-open");
            }
            
            // No cards visible anymore
            this.cardsVisibleNum = 0;
        }
    };