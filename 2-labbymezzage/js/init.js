"use scrict";

// Constructor function for LabbyMezzage
function LabbyMezzage(parentContainerId) {
    
    var _parentContainer = document.getElementById(parentContainerId) || document;
    var _msgContainer;
    var _newMsgContainer;
    var _msgCountContainer;
    var _submitMsgButton;

    var _messages = [];
    
    var that = this;
    
    // Main app Static method
    this.run = function(){
        
        this.createElements();
        
        // Event listener: Add message on submit button press
        _submitMsgButton.onclick = function(){
            that.addMessage();
        }
        
        // Event listener: Add message on enter key press
        this.addEnterListener();
    },

// Methods
    
    this.createElements = function(){
    
    // Message list
        
        // Container
            _msgContainer = document.createElement("main");
    
    // Message form
    
        // Section parent tag
            var section = document.createElement("section");
        
        // Textarea
            _newMsgContainer = document.createElement("textarea");
            _newMsgContainer.setAttribute("id", "message-text")
        
        // Submit button
            _submitMsgButton = document.createElement("button");
            _submitMsgButton.setAttribute("id", "submit-message");
            _submitMsgButton.appendChild(document.createTextNode("Express thoughts"));
        
        // Counter
            var counterParent = document.createElement("div");
            var counterParentText = document.createTextNode("Total number of messages: ")
            counterParent.appendChild(counterParent);
            
            _msgCountContainer = document.createElement("span");
            var counterText = document.createTextNode("0");
            _msgCountContainer.appendChild(counterText);
            
            counterParent.setAttribute("class", "message-counter");
            _msgCountContainer.setAttribute("id", "message-count");
            
            counterParent.appendChild(_msgCountContainer);
        
        // Append stuff
            section.appendChild(_newMsgContainer);
            section.appendChild(_submitMsgButton);
            section.appendChild(counterParent);
            
            _parentContainer.appendChild(_msgContainer);
            _parentContainer.appendChild(section);
        
        // TODO boubles, if not fixed with css.
        
        
    }
    
    this.addMessage = function(){
        
        // Try to create new message and push to container array
        try {
            _messages.push(new Message(_newMsgContainer.value));
        }
        catch (error)
        {
            alert(error.message);
        }
        
        // Print out added message
        this.renderMessage(_messages.length-1);
        
        // Update count
        this.updateCount();
        
        // Empty the textarea
        _newMsgContainer.value = '';
    },
    
    // Remove one message
    this.removeMessage = function(index){
        if(confirm("Are you sure you want to remove this message?")){
            _messages.splice(index, 1);
            this.renderMessages();
            this.updateCount();
        }
    },
    

    // Add message if user presses enter key without shift key.
    this.addEnterListener = function (){

        _newMsgContainer.onkeypress = function(e){
            
            // If enter is pressed without shift key.
            if(!e.shiftKey && e.keyCode === 13){
                
                that.addMessage();
                
                // Prevent default new line behaviour (When pressing enter key.)
                return false;
            }
        }
    },
        
    // Remove all children from parent if children exists
    this.removeChildren = function(parent){
        
        if(typeof(parent) !== "undefined")
        {
            while (parent.firstChild) {
                parent.removeChild(parent.firstChild);
            }
        }
    },
        
    // Update message count
    this.updateCount = function(){
        
        var countText = document.createTextNode(_messages.length);

        this.removeChildren(_msgCountContainer);
        
        _msgCountContainer.appendChild(countText);
        
    },
        
    // Render one message
    this.renderMessage = function(index){
        
        var msg = _messages[index];
        
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
        close.onclick = function()
        {
            that.removeMessage(index);
        }
        
        time.onclick = function()
        {
            alert("Inlägget skapades " + msg.date.toLocaleString());
        }
        
        // Add this new message to dom
        _msgContainer.appendChild(article);
        
    },
        
    // Render all messages, clears container in process.
    this.renderMessages = function(){
        
        var msgContainer = document.getElementById(_msgContainer);
        
        // Clear previous messages
        this.removeChildren(_msgContainer);
        
        // Add all messages, including new one
        for(var index=0; index < _messages.length; index++)
        {
            this.renderMessage(index);
        }
    }
}

// Start the application
window.onload = function(){
    var labby1 = new LabbyMezzage("message-list1");
    labby1.run();
    
    var labby2 = new LabbyMezzage("message-list2");
    labby2.run();
}