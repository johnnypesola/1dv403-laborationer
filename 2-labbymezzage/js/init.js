"use scrict";

    // Start the application
    window.onload = function(){
        
        (function(){
            try {
                var msgBoard1 = new MessageBoard("message-board1");
                msgBoard1.run();
            
                var msgBoard2 = new MessageBoard("message-board2");
                msgBoard2.run();
            }
            catch (error){
                alert(error.message);
            }
        })();
    }