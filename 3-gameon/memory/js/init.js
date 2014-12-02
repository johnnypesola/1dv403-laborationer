"use scrict";

    // Start the application
    window.onload = function(){
        
        (function(){
            try {
                var memoryBoard1 = new MemoryBoard(2, 4, "in-memory-of-amiga1");
                memoryBoard1.run();
                
                var memoryBoard1 = new MemoryBoard(1, 4, "in-memory-of-amiga2");
                memoryBoard1.run();
            }
            catch (error){
                alert(error.message);
            }
        })();
    }