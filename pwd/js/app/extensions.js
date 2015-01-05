"use strict";
   
    (function (){

        // Add a better isInt method for Number
        Number.prototype.isInt = function(){
            
            var parsedVal = parseFloat(this.valueOf());

            return !isNaN(parsedVal) && isFinite(parsedVal) && parsedVal % 1 === 0 && this.valueOf() == parsedVal;    
        }

        // Add move method for Array.
        Array.prototype.move = function (old_index, new_index) {
            if (new_index >= this.length) {
                var k = new_index - this.length;
                while ((k--) + 1) {
                    this.push(undefined);
                }
            }
            this.splice(new_index, 0, this.splice(old_index, 1)[0]);
        };

        // Copy Array.forEach to NodeList.forEach
        NodeList.prototype.forEach = Array.prototype.forEach;

    }());