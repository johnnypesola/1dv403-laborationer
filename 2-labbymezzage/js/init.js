"use scrict";

// Create static container object
var LabbyMezzage = {
    
    messages: [],
    
    // Main app function
    run: function(){
        try {
            
            // Push one message
            LabbyMezzage.messages.push(new Message("my message and it is good!"));
            
            // Push one message
            LabbyMezzage.messages.push(new Message("Message number two!"));
            
            // Push one message
            LabbyMezzage.messages.forEach(function(msg){
                console.log(msg.text);
            })
        }
        catch (error)
        {
            alert(error.message);
        }
    }
}


// Start the application
window.onload = LabbyMezzage.run;