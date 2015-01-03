"use strict";
   
    (function (){

        Number.prototype.isInt = function(){
            
            var parsedVal = parseFloat(this.valueOf());

            return !isNaN(parsedVal) && isFinite(parsedVal) && parsedVal % 1 === 0 && this.valueOf() == parsedVal;    
        }
    
    }());