/**
 * Created by Johnny on 2015-01-03.
 */

'use strict';

// Settings
requirejs.config({
    baseUrl: 'js/lib',
    paths: {
        app: '../app',
        tpl: '../tpl'
    },
    urlArgs: "preventCaching=" + (new Date()).getTime()
});


// Require desktop js file
require(["app/desktop"], function(Desktop){

    // Set up namespace
    var PWD = PWD || {};

    // Start new Desktop application
    PWD.Desktop = PWD.Desktop || new Desktop(document.getElementById("desktop"));
});