"use strict";

// Constructor function for Message Object
    function Message(message, date){
        var _date;
        var _message;
        
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
        
        // Assign constructors default values to properties
        this.date = date || new Date();
        this.text = message || "";
    }

// Add shared Prototype Methods for Message Objects
    Message.prototype.toString = function(){
        return this.text+" ("+this.date+")";
    }
    
    Message.prototype.getHTMLText = function(){
        return (this.text+" ("+this.date+")").replace(/\n/g, "<br>");
    }

// Add custom Prototype Method for Date Objects
    Date.prototype.getHoursMinutesSeconds = function()
    {
        var hours = ('0' + this.getHours()).slice(-2);
        var minutes = ('0' + this.getMinutes()).slice(-2);
        var seconds = ('0' + this.getSeconds()).slice(-2);
        
        return hours + ":" + minutes + ":" + seconds;
    }