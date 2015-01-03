"use strict";

define(["mustache", "app/extensions"], function(Mustache) {
    
    return (function (){

        var Constructor = function(x, y, width, height, zIndex){
            
            var _x,
                _y,
                _width,
                _height,
                _zIndex,
                _minifyButton,
                _closeButton,
                _containerElement,
                _runningApp;
            
        // Properties with Getters and Setters
            Object.defineProperties(this, {
                "x": {
                    get: function(){ return _x || ""; },
                    
                    set: function(value){
                        var parsedValue = parseFloat(value);
                        if(parsedValue.isInt() && parsedValue >= 0){
                            _x = parsedValue;
                        }
                        else{
                            throw new Error("AppContainers x argument must be an int.");
                        }
                    }
                },
                "y": {
                    get: function(){ return _y || ""; },
                    
                    set: function(value){
                        var parsedValue = parseFloat(value);
                        if(!isNaN(parsedValue) && isFinite(parsedValue) && parsedValue >= 0 && parsedValue % 1 === 0 && value === parsedValue){
                            _y = parsedValue;
                        }
                        else{
                            throw new Error("AppContainers y argument must be an int.");
                        }
                    }
                },
                "width": {
                    get: function(){ return _width || ""; },
                    
                    set: function(value){
                        var parsedValue = parseFloat(value);
                        if(!isNaN(parsedValue) && isFinite(parsedValue) && parsedValue >= 0 && parsedValue % 1 === 0 && value === parsedValue){
                            _width = parsedValue;
                        }
                        else{
                            throw new Error("AppContainers width argument must be an int.");
                        }
                    }
                },
                "height": {
                    get: function(){ return _height || ""; },
                    
                    set: function(value){
                        var parsedValue = parseFloat(value);
                        if(!isNaN(parsedValue) && isFinite(parsedValue) && parsedValue >= 0 && parsedValue % 1 === 0 && value === parsedValue){
                            _height = parsedValue;
                        }
                        else{
                            throw new Error("AppContainers height argument must be an int.");
                        }
                    }
                },
                "zIndex": {
                    get: function(){ return _zIndex || ""; },
                    
                    set: function(value){
                        var parsedValue = parseFloat(value);
                        if(!isNaN(parsedValue) && isFinite(parsedValue) && parsedValue >= 0 && parsedValue % 1 === 0 && value === parsedValue){
                            _zIndex = parsedValue;
                        }
                        else{
                            throw new Error("AppContainers zIndex argument must be an int.");
                        }
                    }
                },
                "closeButton": {
                    get: function(){ return _closeButton || ""; },
                    
                    set: function(element){
                        if(element !== null && typeof(element.nodeName) !== "undefined"){
                            _closeButton = element;
                        }
                        else{
                            throw new Error("AppContainers closeButton must be an element");
                        }
                    }
                },
                "minifyButton": {
                    get: function(){ return _minifyButton || ""; },
                    
                    set: function(element){
                        if(element !== null && typeof(element.nodeName) !== "undefined"){
                            _minifyButton = element;
                        }
                        else{
                            throw new Error("AppContainers minifyButton must be an element");
                        }
                    }
                },
                "containerElement": {
                    get: function(){ return _containerElement || ""; },
                    
                    set: function(element){
                        if(element !== null && typeof(element.nodeName) !== "undefined"){
                            _containerElement = element;
                        }
                        else{
                            throw new Error("AppContainers containerElement must be an element");
                        }
                    }
                },
                "runningApp": {
                    get: function(){ return _runningApp || ""; },
                    
                    set: function(obj){
                        console.log(obj);
                        if(obj !== null && typeof obj === "Object"){
                            _runningApp = obj;
                        }
                        else{
                            throw new Error("AppContainers runningApp must be an object");
                        }
                    }
                }
            });
            
        // Init values
            this.x = x || 100;
            this.y = y || 100;
            this.width = width || 320;
            this.height = height || 240;
            this.zIndex = zIndex || 1;
        };
    
        Constructor.prototype = {
            constructor: Constructor,
            
            // Render app
            render: function(appName, content){
                                                
                var that = this;
                                                
                // Create container
                this.containerElement = document.createElement("div");
                this.containerElement.setAttribute("draggable", "true");
                this.containerElement.classList.add("window");
                            
                // Fetch template
                require(["text!tpl/appcontainer.html"], function(template){
                    
                    // Render data in template
                    that.containerElement.innerHTML = Mustache.render(template, {appName: appName, content: content});    
                                       
                    // Fetch references.
                    that.closeButton = that.containerElement.querySelector('a.close');
                    that.minifyButton = that.containerElement.querySelector('a.minify');
                    
                    // Append appContainer to desktop
                    document.getElementById("desktop").appendChild(that.containerElement);
                    
                    // Add events
                    that.addEvents();
                });                
            },
            
            addEvents: function(){
                var that = this,
                    computedStyle,
                    x,
                    y;
                
                this.closeButton.addEventListener("click", function(){
                     
                     // Remove from DOM
                    that.containerElement.parentNode.removeChild(that.containerElement);
                    
                    // !TODO Destroy/Remove this object from nonexisting windowmanager
                });
                
                this.minifyButton.addEventListener("click", function(){
                     
                    // !TODO Hide window and add it to minified state in taskbar.
                });
                
                this.containerElement.addEventListener('dragstart',function(e){
                                        
                    // Get current css computed values of element that triggered the drag.
                    computedStyle = window.getComputedStyle(e.target, null);
                    
                    // Parse and compute the data which should be passed when the drag is dropped.
                    x = (parseInt(computedStyle.getPropertyValue("left"),10) - e.clientX);
                    y = (parseInt(computedStyle.getPropertyValue("top"),10) - e.clientY);
                    
                    // Set this data to be transferred until drop of element.
                    e.dataTransfer.setData("text", x + "," + y);
                }); 
                
                document.getElementById("desktop").addEventListener("drop", function(e){
                    var offset = event.dataTransfer.getData("text/plain").split(',');
                    var dm = document.getElementById('dragme');
                    dm.style.left = (event.clientX + parseInt(offset[0],10)) + 'px';
                    dm.style.top = (event.clientY + parseInt(offset[1],10)) + 'px';
                    event.preventDefault();
                    return false;
                });
            },
            
            moveTo: function(newX, newY){
                this.containerElement.style.left = newX + "px";
                this.containerElement.style.top = newY + "px";
            }
        };
    
        return Constructor;
    
    }());
});

