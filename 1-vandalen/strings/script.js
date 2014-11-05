"use strict";

window.onload = function(){

	// I denna funktion ska du skriva koden för att hantera "spelet"
	var convertString = function(str){
		// Plats för förändring.		
		// Returnera den konverterade strängen.
		// Vid fel, kasta ett undantag med ett meddelande till användaren. 
	
		var returnStr = "";
	
		// Deklarera undantagsklass
		function stringException(message) {
			this.message = message;
		}
		
		// Funktion för att invertera gemener och versaler.
		function invertCharCase(character)
		{
			var returnCharacter;
			
			if(character == character.toUpperCase())
			{
				returnCharacter = character.toLowerCase();
			}
			else
			{
				returnCharacter = character.toUpperCase();
			}
			
			return returnCharacter;
		}

		// Kasta undantag om användaren glömde skriva värde innan submit.
		if(str.length <= 0)
		{
			throw new stringException("Var vänlig skriv minst ett tecken.");
		}
		
		returnStr = str.replace(/[A-Z,Å,Ä,Ö,åäö]/gi, invertCharCase);
		returnStr = returnStr.replace(/[a]/gi, "#");

		return returnStr;

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
			var answer = convertString(input.value) // Läser in texten från textrutan och skickar till funktionen "convertString"
			p.innerHTML = answer;		// Skriver ut texten från arrayen som skapats i funktionen.	
		} catch (error){
			p.classList.add( "error"); // Växla CSS-klass, IE10+
			p.innerHTML = error.message;
		}
	
	});



};