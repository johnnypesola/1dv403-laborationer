"use scrict";

    // Start the application
    window.onload = function(){
        
        (function(){
            try {
                var quizBoard1 = new QuizBoard("quiz-instance1");
                quizBoard1.run();
            }
            catch (error){
                alert(error.message);
            }
        })();
    }