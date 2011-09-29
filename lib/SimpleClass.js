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
                        this._super = _super[name];

                        var ret = fn.apply(this, arguments);       
                        this._super = tmp;

                        return ret;
                    };
                 })(name, prop[name]) : prop[name];
        }

        function search (self, prop, inject) {
            var inject = inject ? inject : self;
            if(self._superClass && self._superClass[prop]) {
                var s = search(self._superClass, prop);
                var obj = s ? s : self._superClass[prop];
                for(var name in obj) {
                    if(self[prop][name] === undefined) {
                        inject[name] = obj[name];
                    } else {
                        inject[name] = self[prop][name];
                    }
                }
            }

            if(self[prop]) {
                for(var name in self[prop]) {
                    inject[name] = self[prop][name];
                }
            }
        }

        // The dummy class constructor
        function Class() {
            // All construction is actually done in the init method
            if (!initializing) {
                if(this.init) {
                    this.init.apply(this, arguments);
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
                for(var name in prop._mix[i].prototype) {
                    Class.prototype[name] = prop._mix[i].prototype[name];
                }
            }
        }

        // Enforce the constructor to be what we expect
        Class.prototype.constructor = Class;
        // Add ability to access our parent object
        Class.prototype._superClass = this.prototype;
        // Add any static properties
        search(Class.prototype, '_static', Class);
        // And make this class extendable
        Class._extend = arguments.callee;

        return Class;
    };
})(window);
