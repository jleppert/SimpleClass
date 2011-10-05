/***
 * @license
 * SimpleClass
 * Copyright(c) 2011 Johnathan Leppert
 * Build: BUILD_VER BUILD_NUM BUILD_TIME BUILD_BY 
 * MIT License
 * Inspired by John Resig's Simple Inheritance and Prototype
 */
;(function(global, undefined) {
    var initializing = false;
    var fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
    var oldClass = global.SimpleClass;
    var Class = function(){};

    global.SimpleClass = Class;

    Class._version = {
        build: BUILD_NUM,
        version: BUILD_VER
    };

    Class._noConflict = function() {
        try {
            delete global['SimpleClass'];
        } catch(e) { }
        
        global.SimpleClass = oldClass;
        return Class;
    };

    Class._extend = function(prop) {
        var prop = prop || {};
        var _super = this.prototype;
        initializing = true;
        var prototype = new this();

        initializing = false;

        for (var name in prop) {
            prototype[name] = typeof prop[name] == "function" &&
                typeof _super[name] == "function" && fnTest.test(prop[name]) ?
                (function(name, fn){
                    return function() {
                        var tmp = this._super;
                        var tmp2 = this._class;
                        this._super = _super[name];
                        this._class = Class.prototype;

                        var ret = fn.apply(this, arguments);       
                        this._super = tmp;
                        this._class = tmp2;

                        return ret;
                    };
                 })(name, prop[name]) : (function(name, fn){
                     if(typeof(prop[name]) == 'function') {
                        return function() {
                            var tmp = this._class;
                            this._class = Class.prototype;
                            
                            var ret = fn.apply(this, arguments);
                            this._class = tmp;

                            return ret;
                        };
                     } else {
                        return prop[name];
                     }
                 })(name, prop[name]);
        }

        function extend(dest, src) {
            for(var item in src) {
                dest[item] = src[item];
            }
        }

        function search (self, prop, inject, append) {
            var inject = inject ? inject : self;
            if(self._superClass && self._superClass[prop]) {
                search(self._superClass, prop, inject, true);
                var obj = self._superClass[prop];
                for(var name in obj) {
                    if(self[prop][name] === undefined) {
                        if(append) {
                            inject[name] instanceof Array ? inject[name].push(obj[name]) : (function() {
                                inject[name] instanceof Object && obj[name] instanceof Object ? extend(inject[name], obj[name]) : inject[name] = obj[name];
                            })();
                        } else {
                            inject[name] = obj[name];
                        }
                    } else {
                        inject[name] = self[prop][name];
                    }
                }
            }

            if(self[prop]) {
                for(var name in self[prop]) {
                    if(append) {
                        inject[name] instanceof Array ? inject[name].push(self[prop][name]) : (function() {
                            inject[name] instanceof Object && self[prop][name] instanceof Object ? extend(inject[name], self[prop][name]) : inject[name] = self[prop][name];
                        })();
                    } else {
                        inject[name] = self[prop][name];
                    }
                }
            }
        }

        // The dummy class constructor
        function Class() {
            // All construction is actually done in the init method
            if (!initializing) {
                if(this._init) {
                    this._init.apply(this, arguments);
                }
                // copy instance properties over to our instance           
                search(Class.prototype, '_instance', this);
            }
        }

        // Populate our constructed prototype object
        Class.prototype = prototype;
        // Add any mixins
        if(prop._mix) {
            for(var i = 0; i < prop._mix.length; i++) {
                var mixClass = prop._mix[i];
               
                if(mixClass.prototype) {
                    // copy prototype properties
                    for(var item in mixClass.prototype) {
                        if(Class.prototype[item] === undefined) {
                            Class.prototype[item] = mixClass.prototype[item];
                        }
                    }
                } else {
                    // copy static properties if we don't have a prototype
                    for(var item in mixClass) {
                        if(Class.prototype[item] === undefined) {
                            Class.prototype[item] = mixClass[item];
                        }
                    }
                }

                // copy prototype properties
                for(var item in mixClass.prototype) {
                    if(Class.prototype[item] === undefined) {
                        Class.prototype[item] = mixClass.prototype[item];
                    }
                }

                if(mixClass.prototype) {
                    // copy mixed classes
                    search(mixClass.prototype, '_mix', Class.prototype._mix, true);
                    
                    // copy instance properties
                    search(mixClass.prototype, '_instance', Class.prototype._instance, true);
                    
                    // copy static properties
                    search(mixClass.prototype, '_static', Class.prototype._static, true);
                }
            }
        }

        // Enforce the constructor to be what we expect
        Class.prototype.constructor = Class;
        // Add ability to access our parent object
        Class.prototype._superClass = this.prototype;
        // Add any static properties
        search(Class.prototype, '_static', Class, true);
        // And make this class extendable
        Class._extend = arguments.callee;

        return Class;
    };
})(window);
