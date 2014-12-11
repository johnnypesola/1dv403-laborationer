"use strict"

/* Constructor function */
    function QuizBoard(parentContainerId){
        
        var _parentContainer,
            _that,
            _BASE_URL = "http://vhost3.lnu.se:20080/",
            _QUESTION_PATH = "question/",
            _ANSWER_PATH = "answer/",
            _FIRST_QUESTION_ID = "1";

        this._questionObjArray = [];

    // Properties with Getters and Setters
        Object.defineProperties(this, {
            "parentContainer": {
                get: function(){ return this._parentContainer || ""; },
                
                set: function(element){
                    if(element !== null && typeof(element.nodeName) !== "undefined"){
                        this._parentContainer = element;
                    }
                    else{
                        throw new Error("ERROR: QuizBoard:s parent container must be an element");
                    }
                }
            },
            "BASE_URL": {
                get: function(){ return _BASE_URL }
            },
            "Q_PATH": {
                get: function(){ return _BASE_URL + _QUESTION_PATH; }
            },
            "A_PATH": {
                get: function(){ return _BASE_URL + _ANSWER_PATH; }
            },
            "FIRST_QUESTION_ID": {
                get: function(){ return _FIRST_QUESTION_ID; }
            }
        });
        
    // Assign constructors default values to properties
        this.parentContainer = document.getElementById(parentContainerId);

    // Main app method
        this.run = function(){
            
            _that = this;
            
            // Create first question and define callback function.
            new Question(this.Q_PATH + this.FIRST_QUESTION_ID, function(questionObj){
                    _that.processQuestion(questionObj);
            });
        };
    }
    
    QuizBoard.prototype = {
        
        constructor:    QuizBoard,
        
        processQuestion:  function(questionObj){
            
            var that = this;
            
            

            // The question has not yet been processed
            if(!questionObj.isProcessed){
                
                // Add question to array.
                this._questionObjArray.push(questionObj);
                
                // Render question.
                this.renderQuestion(questionObj.question);
                
                // Mark question as processed.
                questionObj.isProcessed = true;
            }
            // If the question is answered correctly.
            else if(questionObj.doesExist && questionObj.isCorrectAnswer){
             
                // Show good feedback
                this.showAnswerFeedback(questionObj.containerElement, "RÄTT svar", "green");
             
                // Remove button, not needed anymore
                questionObj.containerElement.removeChild(questionObj.containerElement.querySelector("button"));
                
                // Disable input field
                questionObj.containerElement.querySelector("input").setAttribute("disabled", "");
             
                // Check if quiz is finished
                if(this.isFinished(questionObj)){
                    this.finishGame();
                }
                // The game is not done, add new question.
                else{
                    new Question(questionObj.nextURL, function(questionObj){
                        that.processQuestion(questionObj);
                    });
                }
            }
            // If the question is anwered with wrong answer
            else if(questionObj.doesExist && !questionObj.isCorrectAnswer){

                // Show bad feedback
                this.showAnswerFeedback(questionObj.containerElement, "FEL svar!!!", "red");
            }
        },
        
        finishGame: function(){
            
            var finishedContainer,
                text,
                textContainer,
                header,
                i;
            
            // Create header, and main container
            header = document.createElement("h3");
            header.appendChild(document.createTextNode("Du klarade frågorna med följande antal gissningar:"));

            finishedContainer = document.createElement("div");
            finishedContainer.classList.add("finished");

            finishedContainer.appendChild(header);
            
            // Loop through number of answers, stored in question objects
            for(i = 0; i < this._questionObjArray.length; i++){
                
                // Create text
                textContainer = document.createElement("p");
                text = document.createTextNode("Fråga " + (i+1) + ": " + this._questionObjArray[i].answerCount + " st.");
                textContainer.appendChild(text)
                
                finishedContainer.appendChild(textContainer);
            }
            
            // Append end text to parent container
            this.parentContainer.appendChild(finishedContainer);
        },
        
        showAnswerFeedback: function(containerElement, text, className){
            
            var textContainer;
                
            // Remove old span if it exists
            textContainer = containerElement.querySelector("span");
            
            if(textContainer){
                containerElement.removeChild(textContainer);
            }
            
            // Create new span
            textContainer = document.createElement("span");
            textContainer.appendChild(document.createTextNode(text));
            
            textContainer.removeAttribute("class");
            
            textContainer.classList.add(className);
            
            containerElement.appendChild(textContainer);
            
        },
        
        renderQuestion: function(question){
            
            var questionContainer,
                textContainer,
                input,
                button,
                that;
                
            that = this;

            // Create elements
            textContainer = document.createElement("p");
            input = document.createElement("input");
            button = document.createElement("button");
            questionContainer = document.createElement("div");
            
            
            // Append elements
            textContainer.appendChild(document.createTextNode(question));
            button.appendChild(document.createTextNode("Skicka svar"));
            questionContainer.appendChild(textContainer);
            questionContainer.appendChild(input);
            questionContainer.appendChild(button);
            
            // Add events
            button.onclick = function(e){
                e.preventDefault();
                
                that._questionObjArray[that._questionObjArray.length - 1].answer(
                    { answer: input.value }
                );
            };
            

            // Add container reference to questionContainer
            that._questionObjArray[that._questionObjArray.length - 1].containerElement = questionContainer;
            
            // Append to parent element
            this.parentContainer.appendChild(questionContainer);
        },

        isFinished: function(questionObj){
            return (!questionObj.nextURL);
        }
    };