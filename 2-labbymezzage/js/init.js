"use scrict";

/* Constructor function */
    function LabbyMezzage(parentContainerId) {
        
        this._parentContainer = document.getElementById(parentContainerId) || document;
        this._msgContainer = "";
        this._newMsgContainer = "";
        this._msgCountContainer;
        this._submitMsgButton;
        this._messages = [];
        
        // Main app Static method
        this.run = function(){
            
            this.createElements();
            
            var that = this;
            
            // Event listener: Add message on submit button press
            this._submitMsgButton.onclick = function(){
                that.addMessage();
            }
            
            // Event listener: Add message on enter key press
            this.addEnterListener();
        }
    }
    
/* Prototype methods */

    // Add new message
    LabbyMezzage.prototype.addMessage = function(){
        
        // Create new message and push to container array
        this._messages.push(new Message(this._newMsgContainer.value));
        
        // Print out added message
        this.renderMessage(this._messages.length-1);
        
        // Update count
        this.updateCount();
        
        // Empty the textarea
        this._newMsgContainer.value = '';
    }

    // Initialize elements
    LabbyMezzage.prototype.createElements = function(){
    
    // Message list
        
        // Container
            this._msgContainer = document.createElement("main");
    
    // Message form
    
        // Section parent tag
            var section = document.createElement("section");
        
        // Textarea
            this._newMsgContainer = document.createElement("textarea");
            this._newMsgContainer.setAttribute("id", "message-text")
        
        // Submit button
            this._submitMsgButton = document.createElement("button");
            this._submitMsgButton.setAttribute("id", "submit-message");
            this._submitMsgButton.appendChild(document.createTextNode("Express thoughts"));
        
        // Counter
            var counterParent = document.createElement("div");
            var counterParentText = document.createTextNode("Message count: ")
            counterParent.appendChild(counterParentText);
            
            this._msgCountContainer = document.createElement("span");
            var counterText = document.createTextNode("0");
            this._msgCountContainer.appendChild(counterText);
            
            counterParent.setAttribute("class", "message-counter");
            this._msgCountContainer.setAttribute("id", "message-count");
            
            counterParent.appendChild(this._msgCountContainer);
        
        // Boubles, not really necessary, but for fun.
            var bouble1 = document.createElement("div");
            var bouble2 = document.createElement("div");
            bouble1.setAttribute("class", "big-bouble");
            bouble2.setAttribute("class", "small-bouble");
        
        // Append stuff
            section.appendChild(this._newMsgContainer);
            section.appendChild(this._submitMsgButton);
            section.appendChild(counterParent);
            section.appendChild(bouble1);
            section.appendChild(bouble2);
            
            this._parentContainer.appendChild(this._msgContainer);
            this._parentContainer.appendChild(section);
    }
    
    // Remove one message
    LabbyMezzage.prototype.removeMessage = function(index){
        if(confirm("Are you sure you want to remove this message?")){
            this._messages.splice(index, 1);
            this.renderMessages();
            this.updateCount();
        }
    }
    
    // Add enter key listener
    LabbyMezzage.prototype.addEnterListener = function (){
        
        var that = this;
        
        this._newMsgContainer.onkeypress = function(e){
            
            // If enter is pressed without shift key.
            if(!e.shiftKey && e.keyCode === 13){
                
                that.addMessage();
                
                // Prevent default new line behaviour (When pressing enter key.)
                return false;
            }
        }
    }
    
    // Remove all children from parent if children exists
    LabbyMezzage.prototype.removeChildren = function(parent){
        
        if(typeof(parent) !== "undefined")
        {
            while (parent.firstChild) {
                parent.removeChild(parent.firstChild);
            }
        }
    }

    // Update message count
    LabbyMezzage.prototype.updateCount = function(){
        
        var countText = document.createTextNode(this._messages.length);

        this.removeChildren(this._msgCountContainer);
        
        this._msgCountContainer.appendChild(countText);
        
    }
        
    // Render one message
    LabbyMezzage.prototype.renderMessage = function(index){
        
        var msg = this._messages[index];
        
        // Create elements
        var article = document.createElement("article");
        var text = document.createElement("p");
        var time = document.createElement("a");
        var flap = document.createElement("div");
        var close = document.createElement("a");
        
        // Create content
        var timeContent = document.createTextNode(msg.date.getHoursMinutesSeconds());
        var textContent = msg.getHTMLText();
        
        // Set classes
        time.setAttribute("class", "time");
        flap.setAttribute("class", "flap");
        close.setAttribute("class", "close");
        
        // Append elements
        time.appendChild(timeContent);
        text.innerHTML = textContent;
        
        article.appendChild(text);
        article.appendChild(time);
        article.appendChild(flap);
        article.appendChild(close);

        // Add events
        
        var that = this;
        close.onclick = function()
        {
            that.removeMessage(index);
        }
        
        time.onclick = function()
        {
            alert("Inlägget skapades " + msg.date.toLocaleString());
        }
        
        // Add this new message to dom
        this._msgContainer.appendChild(article);
        
    }
        
    // Render all messages, clears container in process.
    LabbyMezzage.prototype.renderMessages = function(){
        
        // Clear previous messages
        this.removeChildren(this._msgContainer);
        
        // Add all messages, including new one
        for(var index=0; index < this._messages.length; index++)
        {
            this.renderMessage(index);
        }
    }


/* Static onload function */

    // Start the application
    window.onload = function(){
        
        (function() {
            var labby1 = new LabbyMezzage("message-list1");
            labby1.run();    
        
            var labby2 = new LabbyMezzage("message-list2");
            labby2.run();
        })();
    }