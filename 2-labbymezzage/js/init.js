"use scrict";

window.onload = AppContainer.run;

var AppContainer = {
    message : null,
    run: function(){
        // Start labbymezzage application
        this.message = new Message();
    }
}

