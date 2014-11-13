"use scrict";

var AppContainer = {
    message : null,
    run: function(){
        try {
            // Start labbymezzage application
            this.message = new Message("my message and it is good!");
        }
        
        catch (error)
        {
            alert(error.message);
        }
    }
}

// Start the application
window.onload = AppContainer.run;