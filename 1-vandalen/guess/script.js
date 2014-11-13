"use strict";

window.onload = function(){
	
	var secret = 50; // Detta tal behöver bytas ut mot ett slumpat tal.
	
	// I denna funktion ska du skriva koden för att hantera "spelet"
	var guess = function(number){
		console.log("Det hemliga talet: " + secret); // Du når den yttre variabeln secret innifrån funktionen.
		console.log("Du gissade: " + number); // Detta nummer är det som användaren gissade på.
			
		// Plats för förändring.
		
		// Initiera variabler.
		var max = 100;
		var min = 0;
		var returnMsg = "";
		var returnState = false;
		var parsedNumber = parseFloat(number);
		
		// Deklarera globala guessCount om det behövs.
		if(typeof window.guessCount === 'undefined'){
			window.guessCount = 0;
		}

		// Slumpa fram ett hemligt tal om det behövs.
		if(window.guessCount === 0){
			secret = Math.floor( Math.random() * (max-min)+1 )+min; Math.floor( Math.random() * (100-1)+1) + 1; Math.floor( Math.random() * 100)+1;
		}

		window.guessCount++;
		
		// Kollar om det parsade talet är ett giltigt heltal.
		if(!(!isNaN(parsedNumber) && isFinite(parsedNumber) && parsedNumber % 1 === 0 && number == parsedNumber)){
			returnMsg = "Du måste ange ett giltigt heltal emellan 0 och 100";
			returnState = false;
		}
		else if(parsedNumber > max || parsedNumber < min){
			returnMsg = "Talet är utanför intervallet 0 - 100";
			returnState = false;
		}
		else if(secret === parsedNumber){
			returnMsg = "Grattis du vann! Det hemliga talet var " + secret + " och du behövde " + window.guessCount + " gissningar för att hitta det.";
			returnState = true;
			window.guessCount = 0;
		}
		else if(secret > parsedNumber){
			returnMsg = "Det hemliga talet är högre!";
			returnState = false;
		}
		else if(secret < parsedNumber){
			returnMsg = "Det hemliga talet är lägre!";
			returnState = false;
		}
		else {
			returnMsg = "FEL: Hantering av värde ej implementerad.";
			returnState = false;
		}

		return [returnState, returnMsg];

		// Returnera exempelvis: 
		// [true, "Grattis du vann! Det hemliga talet var X och du behövde Y gissningar för att hitta det."]
		// [false, "Det hemliga talet är högre!"]
		// [false, "Det hemliga talet är lägre!"]
		// [false, "Talet är utanför intervallet 0 - 100"]
		
	};
	
	// ------------------------------------------------------------------------------



	// Kod för att hantera utskrift och inmatning. Denna ska du inte behöva förändra
	var p = document.querySelector("#value"); // Referens till DOM-noden med id="#value"
	var input = document.querySelector("#number");
	var submit = document.querySelector("#send");

	// Vi kopplar en eventhanterare till formulärets skickaknapp som kör en anonym funktion.
	submit.addEventListener("click", function(e){
		e.preventDefault(); // Hindra formuläret från att skickas till servern. Vi hanterar allt på klienten.

		var answer = guess(input.value) // Läser in talet från textrutan och skickar till funktionen "guess"
		p.innerHTML = answer[1];		// Skriver ut texten från arrayen som skapats i funktionen.	

		if(answer[0] === true){				// Om spelet är slut, avaktivera knappen.
			submit.disabled = true;
		}
	
	});
};