"use strict";

var makePerson = function(persArr){

	// Din kod här...
	
	var agesArray = [];
	var namesArray = [];
	var ageSum = 0;
	
	// Loopar igenom alla objekt och fyller olika arrays med olika typern av data.
	persArr.forEach(function(personObj){
	    
	    // Kontrollerar data
	    if(typeof(personObj.age) === "number"){
            agesArray.push(personObj.age);
            
            // Räknar ålderssumma
    	    ageSum += personObj.age;
	    }
        if(typeof(personObj.name) === "string"){
            namesArray.push(personObj.name);
	    }
	});
	
	// Sorterar namn, även åäö.
	namesArray.sort(function (a, b) {
        return a.localeCompare(b);
    });

    return  {
                minAge : Math.min.apply(null, agesArray), 
                maxAge : Math.max.apply(null, agesArray),
                averageAge : Math.round(ageSum / agesArray.length),
                names : namesArray.join(", ")
            };
}

