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
    
    // Main app Static function
    run: function(){
            
        try {

            var addButton = document.getElementById(LabbyMezzage.addButton);

            // Attach event to button
            addButton.onclick = function(){
                
                var newMessage = document.getElementById(LabbyMezzage.newMsgContainer).value;

                // Create new message and push to container array
                LabbyMezzage.messages.push(new Message(newMessage));
                
                // Print out messages
                LabbyMezzage.dom.renderMessages();
                
                // Update count
                LabbyMezzage.dom.updateCount(LabbyMezzage.messages.length);
            }
        }
        catch (error)
        {
            alert(error.message);
        }
    },
    
    /* DOM specific Static Methods */
    dom: {
        
        removeChildren: function(parent){
            
            if(typeof(parent) !== "undefined")
            {
                while (parent.firstChild) {
                    parent.removeChild(parent.firstChild);
                }
            }
        },
            
        updateCount: function(count){
            
            var countContainer = document.getElementById(LabbyMezzage.msgCountContainer);
            var countText = document.createTextNode(count);
    
            LabbyMezzage.dom.removeChildren(countContainer);
            
            countContainer.appendChild(countText);
            
        },
            
        renderMessage: function(msg){
            
            var msgContainer = document.getElementById(LabbyMezzage.msgContainer);
            
            // Create elements
            var article = document.createElement("article");
            var text = document.createElement("p");
            var time = document.createElement("div");
            var flap = document.createElement("div");
            var close = document.createElement("a");
            
            // Create content
            var timeContent = document.createTextNode(msg.date.getHours()+":"+msg.date.getMinutes()+":"+msg.date.getSeconds());
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
            
            msgContainer.appendChild(article);
        },
            
        renderMessages: function(){
            
            var msgContainer = document.getElementById(LabbyMezzage.msgContainer);
            
            // Clear previous messages
            LabbyMezzage.dom.removeChildren(msgContainer);
            
            // Add all messages, including new one
            LabbyMezzage.messages.forEach(function(msg){
                LabbyMezzage.dom.renderMessage(msg)
            });
        }
    }
}

// Start the application
window.onload = LabbyMezzage.run;