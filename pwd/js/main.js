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
                
        PWD.AppContainer.render("Men inte såhär", "Kalle Anka är bäst!");
        
        
        PWD.AppContainer2 = PWD.AppContainer2 || new AppContainer(50, 50);
        
        PWD.AppContainer2.render("Min fina app2", "Kalle Anka är bäst igen!");
        
    });