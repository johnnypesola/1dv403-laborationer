"use scrict";

// Create static container object
var LabbyMezzage = {
    
    // Reference element settings
    msgContainer: "message-list",
    msgCountContainer: "message-count",
    newMsgContainer: "message-text",
    submitMsgButton: "submit-message",
    
    // Other declarations
    messages: [],
    
    // Main app Static method
    run: function(){
            
        try {
            
            // Attach event to button
            document.getElementById(LabbyMezzage.submitMsgButton).onclick = function(){
                LabbyMezzage.addMessage();
            }
            
            LabbyMezzage.dom.addEnterListener();
        }
        catch (error)
        {
            alert(error.message);
        }
    },

    // Static methods
    addMessage: function(){
        // Create new message and push to container array
        LabbyMezzage.messages.push(new Message(document.getElementById(LabbyMezzage.newMsgContainer).value));
        
        // Print out added message
        LabbyMezzage.dom.renderMessage(LabbyMezzage.messages.length-1);
        
        // Update count
        LabbyMezzage.dom.updateCount();
        
        // Empty the textarea
        document.getElementById(LabbyMezzage.newMsgContainer).value = "";
    },
    
    // Remove on message in message array container
    removeMessage: function(index){
        LabbyMezzage.messages.splice(index, 1);
    },
    
    // DOM specific Static Methods
    dom: {
        
        // Add message if user presses enter key without shift key.
        addEnterListener: function (){
            var newMsgContainer = document.getElementById(LabbyMezzage.newMsgContainer);
            
            newMsgContainer.onkeypress = function(e){
                
                if(!e.shiftKey && e.keyCode === 13){
                    
                    LabbyMezzage.addMessage();
                    
                    // Scroll to the bottom of the page.
                    window.scrollTo(0,document.body.scrollHeight);
                }
            }
        },
        
        // Remove all children from parent if children exists
        removeChildren: function(parent){
            
            if(typeof(parent) !== "undefined")
            {
                while (parent.firstChild) {
                    parent.removeChild(parent.firstChild);
                }
            }
        },
        
        // Update message count
        updateCount: function(){
            
            var countContainer = document.getElementById(LabbyMezzage.msgCountContainer);
            var countText = document.createTextNode(LabbyMezzage.messages.length);
    
            LabbyMezzage.dom.removeChildren(countContainer);
            
            countContainer.appendChild(countText);
            
        },
        
        // Render one message
        renderMessage: function(index){
            
            var msg = LabbyMezzage.messages[index];
            var msgContainer = document.getElementById(LabbyMezzage.msgContainer);
            
            // Create elements
            var article = document.createElement("article");
            var text = document.createElement("p");
            var time = document.createElement("a");
            var flap = document.createElement("div");
            var close = document.createElement("a");
            
            // Create content
            var timeContent = document.createTextNode(msg.date.getHoursMinutesSeconds());
            var textContent = document.createTextNode(msg.text);
            
            // Set classes
            time.setAttribute("class", "time");
            flap.setAttribute("class", "flap");
            close.setAttribute("class", "close");
            
            // Append elements
            time.appendChild(timeContent);
            text.appendChild(textContent);
            
            article.appendChild(text);
            article.appendChild(time);
            article.appendChild(flap);
            article.appendChild(close);

            // Add events
            close.onclick = function()
            {
                LabbyMezzage.removeMessage(index);
                LabbyMezzage.dom.renderMessages();
                LabbyMezzage.dom.updateCount();
            }
            
            time.onclick = function()
            {
                alert("Inlägget skapades " + msg.date.toLocaleString());
            }
            
            // Add this new message to dom
            msgContainer.appendChild(article);
            
        },
        
        // Render all messages, clears container in process.
        renderMessages: function(){
            
            var msgContainer = document.getElementById(LabbyMezzage.msgContainer);
            
            // Clear previous messages
            LabbyMezzage.dom.removeChildren(msgContainer);
            
            // Add all messages, including new one
            for(var index=0; index < LabbyMezzage.messages.length; index++)
            {
                LabbyMezzage.dom.renderMessage(index);
            }
        }
    }
}

// Start the application
window.onload = LabbyMezzage.run;