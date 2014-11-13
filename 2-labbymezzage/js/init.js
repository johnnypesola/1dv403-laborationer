"use scrict";

var AppContainer = {
    message : null,
    run: function(){
        // Start labbymezzage application
        this.message = new Message("my message", "my date");

        this.message.date = new Date();
        
        this.message.date = "korv";
    }
}

// Start the application
window.onload = AppContainer.run;