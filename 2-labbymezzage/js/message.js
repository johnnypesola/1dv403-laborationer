"use strict";

/* Constructor function */
    function Message(message, date){
        var _date;
        var _message;
        
        // Properties with getters and Setters
        Object.defineProperties(this, {
            "text": {
                get: function() { return this._message || ""; },
                set: function(value) { this._message = value; }
            },
            "date": {
                get: function() { return this._date || ""; },
                set: function(value) {
                    if(!(value instanceof Date))
                    {
                        throw new Error("ERROR: the date property can only contain a date object");
                    }
                    this._date = value;
                }
            }
        });
        
        // Assign constructors default values to properties
        this.date = date || new Date();
        this.text = message || "";
    }

/* Prototype methods */
    Message.prototype.toString = function(){
        return this.text+" ("+this.date+")";
    }
    
    Message.prototype.getHTMLText = function(){
        return this.text.replace(/\n/g, "<br>");
    }

/* Extended prototype methods for Date Objects */
    Date.prototype.getHoursMinutesSeconds = function()
    {
        var hours = ('0' + this.getHours()).slice(-2);
        var minutes = ('0' + this.getMinutes()).slice(-2);
        var seconds = ('0' + this.getSeconds()).slice(-2);
        
        return hours + ":" + minutes + ":" + seconds;
    }