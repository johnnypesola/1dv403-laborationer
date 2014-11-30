"use strict"

/* Constructor function */
    function MemoryCard(number){
        var _cardNum;
        
        // Properties with getters and Setters
        Object.defineProperties(this, {
            "cardNum": {
                get: function(){ return this._cardNum },
                set: function(value){
                    var parsedValue = parseFloat(value);
                    if(!(!isNaN(parsedValue) && isFinite(parsedValue) && parsedValue % 1 === 0 && value == parsedValue)){
                        throw new Error("ERROR: cardNum property must be an int.");
                    }
                    
                    this._cardNum = value;
                }
            }
        });
            
        // Assign constructors default values to properties
        this.cardNum = number || 0;
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
        }
    };