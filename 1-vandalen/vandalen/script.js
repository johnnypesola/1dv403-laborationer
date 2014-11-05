"use strict";

var makePerson = function(persArr){

	// Din kod här...
	
	var agesArray = new Array();
	var namesArray = new Array();
	var ageSum = 0;
	
	// Loopar igenom alla objekt och fyller olika arrays med olika typern av data.
	persArr.forEach(function(personObj){
	    agesArray.push(personObj.age);
	    namesArray.push(personObj.name);

        // Räknar ålderssumma
	    ageSum += personObj.age;
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

