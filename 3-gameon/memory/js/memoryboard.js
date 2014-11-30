"use strict"

/* Constructor function */
    function MemoryBoard(rows, columns, parentContainerId){
        
        var _parentContainer,
            _cardTemplateArray,
            _number,
            _rows,
            _columns;
        this._cards = [];
        
    // Properties with Getters and Setters
        Object.defineProperties(this, {
            "parentContainer": {
                get: function(){ return this._parentContainer || ""; },
                
                set: function(element){
                    if(element !== null && typeof(element.nodeName) !== "undefined"){
                        this._parentContainer = element;
                    }
                    else{
                        throw new Error("ERROR: MemoryBoard:s container must be an element");
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
            }
        });
        
    // Assign constructors default values to properties
        this.parentContainer = parentContainerId;
        this.rows = rows || 2;
        this.columns = columns || 2;

    // Main app method
        this.run = function(){
            
            // Generate array to fill with cards
            _cardTemplateArray = this.getPictureArray(rows, columns);
            
            // Generate card for each entry in _cards array
            for(_number in _cardTemplateArray){
                this._cards.push(new MemoryCard(_number))
            }
            
            
            
            console.log(this._cards.length);
            
            console.log(this._cards[0].getTitle());
            
            console.log("Memoryboard run");
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
    	
        createCardElement: function(id){
        
            var cardContainer,
                flipper,
                front,
                back,
                titleContainer,
                titleTextContainer,
                titleTextNode;
            
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
                front = document.createElement("div");
                front.classList.add("front");
            
            // Back side of the card
                back = document.createElement("div");
                back.classList.add("back");
                
            // Card flipper container, necessary for css card flip animation
                flipper = document.createElement("div");
                flipper.classList.add("flipper");
                flipper.appendChild(front);
                flipper.appendChild(back);
                
            // Container
                cardContainer = document.createElement("div");
                flipper.classList.add("card-container");
                cardContainer.appendChild(flipper);
                

                
                this.parentContainer.appendChild(this.msgContainer);
                this.parentContainer.appendChild(section);
        }
        
    };