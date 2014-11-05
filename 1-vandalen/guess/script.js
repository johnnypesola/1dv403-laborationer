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

		// Deklarera guessCount om det behövs.		
		if(typeof window.guessCount === 'undefined')
		{

			window.guessCount = 0;
		}

		// Slumpa fram ett hemligt tal om det behövs.
		if(window.guessCount == 0)
		{
			secret = Math.floor( Math.random() * (max-min)+1 )+min; Math.floor( Math.random() * (100-1)+1) + 1; Math.floor( Math.random() * 100)+1;
		}

		window.guessCount++;
		
		if(!(!isNaN(parseFloat(number)) && isFinite(number) && number % 1 === 0))
		{
			returnMsg = "Du måste ange ett giltigt heltal emellan 0 och 100";
			returnState = false;
		}
		else if(number > max || number < min)
		{
			returnMsg = "Talet är utanför intervallet 0 - 100";
			returnState = false;
		}
		else if(secret == number)
		{
			returnMsg = "Grattis du vann! Det hemliga talet var " + secret + " och du behövde " + guessCount + " gissningar för att hitta det."
			returnState = true;
			window.guessCount = 0;
		}
		else if(secret > number)
		{
			returnMsg = "Det hemliga talet är högre!"
			returnState = false;
		}
		else if(secret < number)
		{
			returnMsg = "Det hemliga talet är lägre!"
			returnState = false;
		}
		else
		{
			returnMsg = "FEL: Hantering av värde ej implementerad."
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