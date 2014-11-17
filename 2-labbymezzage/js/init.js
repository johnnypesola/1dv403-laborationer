"use scrict";

// Create static container object
var LabbyMezzage = {
    
    messages: [],
    
    // Main app Static function
    run: function(){
        
            var button;
            var message;
            
        try {

        /* Events */

            // Get elements references
            button = document.getElementById("submit-message");
            
            // Attach event to button
            button.onclick = function(){
                
                // Get current message
                message = document.getElementById("message-text").value;
                
                // Create new message and push to container array
                LabbyMezzage.messages.push(new Message(message));
                
                // Print out messages
                LabbyMezzage.dom.printMessages();
                
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
            
            var countContainer = document.getElementById("message-count");
            var countText = document.createTextNode(count);
    
            LabbyMezzage.dom.removeChildren(countContainer);
            
            countContainer.appendChild(countText);
            
        },
            
        printMessages: function(){
            
            var messageListContainer = document.getElementById("message-list");
            
            // Clear previous messages
            LabbyMezzage.dom.removeChildren(messageListContainer);
            
            // Add all messages, including new one
            LabbyMezzage.messages.forEach(function(msg){
                
                // Create elements
                var article = document.createElement("article");
                var text = document.createElement("p");
                var time = document.createElement("div");
                var flap = document.createElement("div");
                var close = document.createElement("a");
                
                // Create content
                var timeContent = document.createTextNode(msg.date.getHours()+ ":"+msg.date.getMinutes()+":"+msg.date.getSeconds());
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
                
                messageListContainer.appendChild(article);
            });
        }
    }
}

// Start the application
window.onload = LabbyMezzage.run;