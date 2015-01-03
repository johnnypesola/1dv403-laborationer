'use strict';

    // Settings
    requirejs.config({
        baseUrl: 'js/lib',
        paths: {
            app: '../app',
            tpl: '../tpl'            
        }
    });
    

    // Start the application
    var PWD = PWD || {};

    require(["app/appcontainer"], function(AppContainer){
        
        // Start new appcontainer
        PWD.AppContainer = PWD.AppContainer || new AppContainer();        
        
        PWD.AppContainer.render("Min fina app", "Kalle Anka är bäst!");
        
    });