"use strict";

window.onload = function(){

	
	var birthday = function(date){
		

	// Din kod här.

		var dateParsed = new Date(date);
		var dateNow = new Date();
		var daysToBday;
		var msInDay = 1000*60*60*24;

		// Deklarera undantagsklass
		function stringException(message) {
			this.message = message;
		}

		// Datumobjekt
		if(!isNaN(dateParsed))
		{
			// Uppdatera parsed year med det aktuella året
			dateParsed.setFullYear(dateNow.getFullYear());

			// Öka dateParsed med ett år om födelsedagen har passerat.
			if( dateParsed.getMonth() < dateNow.getMonth() || 
				dateParsed.getMonth() == dateNow.getMonth() && 
				dateParsed.getDate() < dateNow.getDate() )
			{
				dateParsed.setFullYear(dateParsed.getFullYear() + 1)
			}
			
			// Eftersom vi använder Date.getTime() metoden så behöver vi inte oroa oss för skottår.
			daysToBday =  Math.ceil( (dateParsed.getTime() - dateNow.getTime()) / msInDay );
			
			return daysToBday
		}
		else
		{
			throw new stringException("Skriv födelsedatumet efter formatet: åååå-mm-dd exempelvis 1999-12-24");
		}
	};
	// ------------------------------------------------------------------------------


	// Kod för att hantera utskrift och inmatning. Denna ska du inte behöva förändra
	var p = document.querySelector("#value"); // Referens till DOM-noden med id="#value"
	var input = document.querySelector("#string");
	var submit = document.querySelector("#send");

	// Vi kopplar en eventhanterare till formulärets skickaknapp som kör en anonym funktion.
	submit.addEventListener("click", function(e){
		e.preventDefault(); // Hindra formuläret från att skickas till servern. Vi hanterar allt på klienten.

		p.classList.remove( "error");

		try {
			var answer = birthday(input.value) // Läser in texten från textrutan och skickar till funktionen "convertString"
			var message;
			switch (answer){
				case 0: message = "Grattis på födelsedagen!";
					break;
				case 1: message = "Du fyller år imorgon!";
					break;
				default: message = "Du fyller år om " + answer + " dagar";
					break;
			}

			p.innerHTML = message;
		} catch (error){
			p.classList.add( "error"); // Växla CSS-klass, IE10+
			p.innerHTML = error.message;
		}
	
	});



};