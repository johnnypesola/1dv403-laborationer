"use strict"

/* Constructor function */
    function MemoryCard(number){
        var _cardNum,
            _isCardOpen,
            _isMatchFound;
        
        // Properties with getters and Setters
        Object.defineProperties(this, {
            "cardNum": {
                get: function(){ return this._cardNum },
                set: function(value){
                    var parsedValue = parseFloat(value);
                    if(!(!isNaN(parsedValue) && isFinite(parsedValue) && parsedValue % 1 === 0 && value == parsedValue)){
                        throw new Error("ERROR: cardNum property must be an int type.");
                    }
                    
                    this._cardNum = value;
                }
            },
            "isCardOpen": {
                get: function(){ return this._isCardOpen },
                set: function(value){
                    if(typeof value !== "boolean" ){
                        throw new Error("ERROR: isCardOpen property must be a boolean type.");
                    }
                    
                    this._isCardOpen = value;
                }
            },
            "isMatchFound": {
                get: function(){ return this._isMatchFound },
                set: function(value){
                    if(typeof value !== "boolean" ){
                        throw new Error("ERROR: isMatchFound property must be a boolean type.");
                    }
                    
                    this._isMatchFound = value;
                }
            }
        });
            
        // Assign constructors default values to properties
        this.cardNum = number || 0;
        this.isCardOpen = false;
        this.isMatchFound = false;
    }

/* Prototypes */
    MemoryCard.prototype = {
        constructor:    MemoryCard,
        
        titleArray: [
                        "Simon the sorcerer",
                        "Cannon fodder",
                        "Flashback",
                        "It Came From The Desert",
                        "Pirates!",
                        "Stunt Racer",
                        "Beneath A Steel Sky",
                        "Leisure suit Larry 3"
        ],
        
        getCssClass: function(){
            return this.titleArray[this.cardNum].replace(/\s+/g, '-').toLowerCase().replace(/[^0-9a-zåäö\-]/g,'');
        },
        
        getTitle: function(){
            return this.titleArray[this.cardNum];
        },
        
        isEqualTo: function(obj){
            if(obj instanceof MemoryCard && obj.cardNum == this.cardNum){
                return true;
            }
            return false;
        }
        
    };