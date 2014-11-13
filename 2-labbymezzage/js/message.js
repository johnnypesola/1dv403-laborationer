"use strict";

function Message(message, date){
    message = message || "";
    date = date || "";
    
   // Getters and Setters
    // Text
    this.getText = function()
    {
        return message;
    }
    this.setText = function(_text)
    {
        message = _text;
    }
    
    // Date
    this.getDate = function()
    {
        return date;
    }
    this.setDate = function(_date)
    {
        date = _date;
    }
    
    
}
