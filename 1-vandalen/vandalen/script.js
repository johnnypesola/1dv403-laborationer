"use strict";

var makePerson = function(persArr){

	// Din kod här...
	
	var agesArray = new Array();
	var namesArray = new Array();
	var ageSum = 0;
	
	persArr.forEach(function(personObj){
	    agesArray.push(personObj.age);
	    namesArray.push(personObj.name);

	    ageSum += personObj.age;
	})

    return  {
                minAge : Math.min.apply(null, agesArray), 
                maxAge : Math.max.apply(null, agesArray),
                averageAge : Math.round(ageSum / agesArray.length),
                names : namesArray.sort().join(", ")
            };

/*
    Objektet som returneras ska innehålla fyra egenskaper:
    
    minAge - nummer innehållande den ålder i de inskickade objekten som är lägst.
    maxAge -nummer innehållande den ålder i de inskickade objekten som är högst.
    avarageAge - nummer innehållande medelåldern av de inskickade objektens ålder.
    names - sträng innehållande samtliga personers namn separerade med ", " 
    (komma och efterföljande mellanslag). Namnen sorteras i bokstavsordning.
*/

}

