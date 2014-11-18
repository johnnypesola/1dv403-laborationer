/* Constructor function */
    function MessageBoard(parentContainerId) {
        
        var _parentContainer;
        var _msgContainer;
        var _newMsgContainer;
        var _msgCountContainer;
        var _submitMsgButton;
        this._messages = [];
        
    // Properties with Getters and setters

        // .parentContainer property
        Object.defineProperty(this, "parentContainer", {
            get: function() { return this._parentContainer || ""; },
            
            set: function(element) {
                if(element !== null && typeof(element.nodeName) !== "undefined")
                {
                    this._parentContainer = element;
                }
                else
                {
                    throw new Error("ERROR: MessageBoard:s container must be an element");
                }
            }
        });
        
        // .msgContainer property
        Object.defineProperty(this, "msgContainer", {
            get: function() { return this._msgContainer || ""; },
            
            set: function(element) {
                if(element !== null && typeof(element.nodeName) !== "undefined")
                {
                    this._msgContainer = element;
                }
                else
                {
                    throw new Error("ERROR: msgContainer must be an element");
                }
            }
        });
        
        // .newMsgContainer property
        Object.defineProperty(this, "newMsgContainer", {
            get: function() { return this._newMsgContainer || ""; },
            
            set: function(element) {
                if(element !== null && typeof(element.nodeName) !== "undefined" && element.nodeName.toLowerCase() == "textarea")
                {
                    this._newMsgContainer = element;
                }
                else
                {
                    throw new Error("ERROR: newMsgContainer property can only contain an textarea element");
                }
            }
        });

        // .msgCountContainer property
        Object.defineProperty(this, "msgCountContainer", {
            get: function() { return this._msgCountContainer || ""; },
            
            set: function(element) {
                if(element !== null && typeof(element.nodeName) !== "undefined")
                {
                    this._msgCountContainer = element;
                }
                else
                {
                    throw new Error("ERROR: msgCountContainer must be an element");
                }
            }
        });
        
        // .submitMsgButton property
        Object.defineProperty(this, "submitMsgButton", {
            get: function() { return this._submitMsgButton || ""; },
            set: function(element) {
                if(typeof(element.nodeName) !== "undefined" && element.nodeName.toLowerCase() == "button")
                {
                    this._submitMsgButton = element;
                }
                else
                {
                    throw new Error("ERROR: submitMsgButton property can only contain an button element");
                }
            }
        });
        
    // Default values
        this.parentContainer = document.getElementById(parentContainerId);
        
    // Main app method
        this.run = function(){
            
            this.createElements();
            
            var that = this;
            
            // Event listener: Add message on submit button press
            this.submitMsgButton.onclick = function(){
                that.addMessage();
            }
            
            // Event listener: Add message on enter key press
            this.addEnterListener();
        }
    }
    
/* Prototype methods */

    // Add new message
    MessageBoard.prototype.addMessage = function(){
        
        // Create new message and push to container array
        this._messages.push(new Message(this.newMsgContainer.value));
        
        // Print out added message
        this.renderMessage(this._messages.length-1);
        
        // Update count
        this.updateCount();
        
        // Empty the textarea
        this.newMsgContainer.value = '';
    }

    // Initialize elements
    MessageBoard.prototype.createElements = function(){
    
    // Message list
        
        // Container
            this.msgContainer = document.createElement("main");
    
    // Message form
    
        // Section parent tag
            var section = document.createElement("section");
        
        // Textarea
            this.newMsgContainer = document.createElement("textarea");
            this.newMsgContainer.setAttribute("id", "message-text")
        
        // Submit button
            this.submitMsgButton = document.createElement("button");
            this.submitMsgButton.setAttribute("id", "submit-message");
            this.submitMsgButton.appendChild(document.createTextNode("Express thoughts"));
        
        // Counter
            var counterParent = document.createElement("div");
            var counterParentText = document.createTextNode("Message count: ")
            counterParent.appendChild(counterParentText);
            
            this.msgCountContainer = document.createElement("span");
            var counterText = document.createTextNode("0");
            this.msgCountContainer.appendChild(counterText);
            
            counterParent.setAttribute("class", "message-counter");
            this.msgCountContainer.setAttribute("id", "message-count");
            
            counterParent.appendChild(this.msgCountContainer);
        
        // Boubles, not really necessary, but for fun.
            var bouble1 = document.createElement("div");
            var bouble2 = document.createElement("div");
            bouble1.setAttribute("class", "big-bouble");
            bouble2.setAttribute("class", "small-bouble");
        
        // Append stuff
            section.appendChild(this.newMsgContainer);
            section.appendChild(this.submitMsgButton);
            section.appendChild(counterParent);
            section.appendChild(bouble1);
            section.appendChild(bouble2);
            
            this.parentContainer.appendChild(this.msgContainer);
            this.parentContainer.appendChild(section);
    }
    
    // Remove one message
    MessageBoard.prototype.removeMessage = function(index){
        if(confirm("Are you sure you want to remove this message?")){
            this._messages.splice(index, 1);
            this.renderMessages();
            this.updateCount();
        }
    }
    
    // Add enter key listener
    MessageBoard.prototype.addEnterListener = function (){
        
        var that = this;
        
        this.newMsgContainer.onkeypress = function(e){
            
            // If enter is pressed without shift key.
            if(!e.shiftKey && e.keyCode === 13){
                
                that.addMessage();
                
                // Prevent default new line behaviour (When pressing enter key.)
                return false;
            }
        }
    }
    
    // Remove all children from parent if children exists
    MessageBoard.prototype.removeChildren = function(parent){
        
        if(typeof(parent) !== "undefined")
        {
            while (parent.firstChild) {
                parent.removeChild(parent.firstChild);
            }
        }
    }

    // Update message count
    MessageBoard.prototype.updateCount = function(){
        
        var countText = document.createTextNode(this._messages.length);

        this.removeChildren(this.msgCountContainer);
        
        this.msgCountContainer.appendChild(countText);
        
    }
        
    // Render one message
    MessageBoard.prototype.renderMessage = function(index){
        
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
        this.msgContainer.appendChild(article);
        
    }
        
    // Render all messages, clears container in process.
    MessageBoard.prototype.renderMessages = function(){
        
        // Clear previous messages
        this.removeChildren(this.msgContainer);
        
        // Add all messages, including new one
        for(var index=0; index < this._messages.length; index++)
        {
            this.renderMessage(index);
        }
    }