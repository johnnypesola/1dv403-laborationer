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

    require(["app/desktop"], function(Desktop){

        // Start new appcontainer

        PWD.Desktop = PWD.Desktop || new Desktop(document.getElementById("desktop"));

        PWD.Desktop.startApp("Hallojsan!", 100, 500);


        document.addEventListener("keydown", function (e) {
            if (e.keyCode === 13) {
                PWD.Desktop.startApp("Test", 300, 400);
            }
        }, false);

/*

        PWD.AppContainer.render("Men inte såhär", "Kalle Anka är bäst!");

        PWD.AppContainer2 = PWD.AppContainer2 || new AppContainer(50, 50);

        PWD.AppContainer2.render("Min fina app2", "Kalle Anka är bäst igen!");



*/
    });