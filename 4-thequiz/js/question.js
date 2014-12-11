"use strict"

/* Constructor function */
    function Question(url, callBack){
        var _isCorrectAnswer,
            _isProcessed,
            _answerCount,
            _doesExist,
            _callBack,
            _url,
            _answerUrl,
            _containerElement;
            
        this._responseObj = {};
        
    // Properties with Getters and Setters
        Object.defineProperties(this, {
            "containerElement": {
                get: function(){ return this._containerElement || ""; },
                
                set: function(element){
                    if(element !== null && typeof(element.nodeName) !== "undefined"){
                        this._containerElement = element;
                    }
                    else{
                        throw new Error("ERROR: the question object's containerElement must be an element");
                    }
                }
            },
            "id": {
                get: function(){ return this._responseObj.id || ""; },
            },
            "question": {
                get: function(){ return this._responseObj.question || ""; },
            },
            "nextURL": {
                get: function(){ return this._responseObj.nextURL || ""; },
            },
            "message": {
                get: function(){ return this._responseObj.message || ""; },
            },
            "isCorrectAnswer": {
                get: function(){ return _isCorrectAnswer },
                set: function(value){
                    if(typeof value !== "boolean" ){
                        throw new Error("ERROR: 'isCorrectAnswer' property must be a boolean type.");
                    }
                    
                    _isCorrectAnswer = value;
                }
            },
            "isProcessed": {
                get: function(){ return _isProcessed },
                set: function(value){
                    if(typeof value !== "boolean" ){
                        throw new Error("ERROR: 'isProcessed' property must be a boolean type.");
                    }
                    
                    _isProcessed = value;
                }
            },
            "answerCount": {
                get: function(){ return _answerCount },
                
                set: function(value){
                    var parsedValue = parseFloat(value);
                    if(!(!isNaN(parsedValue) && isFinite(parsedValue) && parsedValue >= 0 && parsedValue % 1 === 0 && value == parsedValue)){
                        throw new Error("ERROR: 'answerCount' property must be an integer and at least 0");
                    }
                    
                    _answerCount = value;
                }
            },
            "doesExist": {
                get: function(){ return _doesExist },
                set: function(value){
                    if(typeof value !== "boolean" ){
                        throw new Error("ERROR: 'doesExist' property must be a boolean type.");
                    }
                    
                    _doesExist = value;
                }
            },
            "callBack": {
                get: function(){ return _callBack || ""; },
                set: function(value){
                    if(typeof value !== "function" ){
                        throw new Error("ERROR: 'callBack' property must be a function.");
                    }
                    
                    _callBack = value;
                }
            },
            "url": {
                get: function(){ return _url || ""; },
                set: function(value){
                    if(typeof value !== "string" ){
                        throw new Error("ERROR: 'url' property must be a string.");
                    }
                    
                    _url = value;
                }
            },
        });
        
    // Assign constructors default values to properties
        this.isCorrectAnswer = false;
        this.isProcessed = false;
        this.doesExist = false;
        this.callBack = callBack;
        this.url = url;
        this.answerCount = 0;
        
        
    // Main constructor function action
        this.fetch();
    }
    
    Question.prototype = {
        
        constructor: Question,
        
        fetch: function(){
            this.ajaxCall("GET", this.url);
        },
        
        answer: function(answerObj){
            this.ajaxCall("POST", this.nextURL, answerObj);
            
            this.answerCount += 1;
        },
        
        handleAjaxResponse:    function(httpRequest, method){
            
            // When request is completed
            if (httpRequest.readyState === 4 && httpRequest.responseText.length > 0){
                
                // If the HTTP result code was succesful, could mean correct answer to question.
                if (httpRequest.status === 200){
                    
                    this._responseObj = JSON.parse(httpRequest.responseText);
                    
                    this.doesExist = true;
                    this.isCorrectAnswer = (method === "POST" ? true : false);
                }
                // If the HTTP result code was "Bad request", also means wrong answer to question.
                else if (httpRequest.status === 400){
                    
                    this.doesExist = true;
                    this.isCorrectAnswer = false;
                }
                // If the HTTP result code was "Not found", the question does not exist.
                else if (httpRequest.status === 404){
                    this.doesExist = false;
                    this.isCorrectAnswer = false;
                }
                else {
                    throw new Error('There was a problem with the ajax request.');
                }
                
                // Update response object as long as no answer is posted
                if(method === "GET"){
//                    this._responseObj = JSON.parse(httpRequest.responseText);
                }
                
                // Run callback function and send reference to this object as parameter
                this.callBack(this);
            }
        },
        
        ajaxCall:   function(method, url, parametersObj){
            
            var httpRequest,
                parameters,
                that = this;

            // Format parameters, if any
            parameters = (parametersObj ? JSON.stringify(parametersObj) : null);
            
            // Modern browsers
            if (window.XMLHttpRequest){ 
                httpRequest = new XMLHttpRequest();
            }
            else {
                throw new Error("Browser does not support XMLHttpRequest");
            }
            
            // How to process the server response
            httpRequest.onreadystatechange = function(){
                that.handleAjaxResponse(httpRequest, method);
            };
            
            // Open request
            httpRequest.open(method, url);
            
            // Optional parameters
            if(method === "POST"){
                httpRequest.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
            }
            
            // Send parameters
            httpRequest.send(parameters);
        }
        
    };