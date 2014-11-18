"use scrict";

// Create static container object
var LabbyMezzage = {
    
    // Reference element settings
    msgContainer: "message-list",
    msgCountContainer: "message-count",
    newMsgContainer: "message-text",
    addButton: "submit-message",
    
    // Other declarations
    messages: [],
    
    // Main app Static method
    run: function(){
            
        try {

            var addButton = document.getElementById(LabbyMezzage.addButton);

            // Attach event to button
            addButton.onclick = function(){
                
                var newMessage = document.getElementById(LabbyMezzage.newMsgContainer).value;

                // Create new message and push to container array
                LabbyMezzage.messages.push(new Message(newMessage));
                
                // Print out added message
                LabbyMezzage.dom.renderMessage(LabbyMezzage.messages.length-1);
                
                // Update count
                LabbyMezzage.dom.updateCount();
            }
        }
        catch (error)
        {
            alert(error.message);
        }
    },
    
    // Static methods
    removeMessage: function(index){
        LabbyMezzage.messages.splice(index, 1);
    },
    
    // DOM specific Static Methods
    dom: {
        
        removeChildren: function(parent){
            
            if(typeof(parent) !== "undefined")
            {
                while (parent.firstChild) {
                    parent.removeChild(parent.firstChild);
                }
            }
        },
            
        updateCount: function(){
            
            var countContainer = document.getElementById(LabbyMezzage.msgCountContainer);
            var countText = document.createTextNode(LabbyMezzage.messages.length);
    
            LabbyMezzage.dom.removeChildren(countContainer);
            
            countContainer.appendChild(countText);
            
        },
            
        renderMessage: function(index){
            
            var msg = LabbyMezzage.messages[index];
            var msgContainer = document.getElementById(LabbyMezzage.msgContainer);
            
            // Create elements
            var article = document.createElement("article");
            var text = document.createElement("p");
            var time = document.createElement("div");
            var flap = document.createElement("div");
            var close = document.createElement("a");
            
            // Format time
            var hours = ('0' + msg.date.getHours()).slice(-2);
            var minutes = ('0' + msg.date.getMinutes()).slice(-2);
            var seconds = ('0' + msg.date.getSeconds()).slice(-2);
            
            // Create content
            var timeContent = document.createTextNode(hours+":"+minutes+":"+seconds);
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
            
            // Add this new message to dom
            msgContainer.appendChild(article);
            
        },
            
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