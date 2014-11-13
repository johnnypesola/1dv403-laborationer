"use strict";

// Constructor function for Message Object
    function Message(message, date){
        var _date;
        var _message;
        
    // Assign constructor default values
        this.date = date || new Date();
        this.text = message || "";
        
    // Assign Properties with getters and setters

        // Message.text property
        Object.defineProperty(this, "text", {
            get: function() { return this._message || ""; },
            set: function(value) { this._message = value; }
        });
        
        // Message.date property
        Object.defineProperty(this, "date", {
            get: function() { return this._date || ""; },
            set: function(value) {
                if(!(value instanceof Date))
                {
                    throw new Error("FEL: egenskapen date får endast innehålla datumobjekt");
                }
                this._date = value;
            }
        });
    }

// Add shared Prototype Methods for Message Object
    Message.prototype.toString = function(){
        return this.getText()+" ("+this.getDate()+")";
    }
    
    Message.prototype.getHTMLText = function(){
        return (this.getText()+" ("+this.getDate()+")").replace(/\n/g, "<br>");
    }
