(function() {
    var randomString = function() {
        var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
        var string_length = 8;
        var randomString = '';
        
        for (var i=0; i<string_length; i++) {
            var rnum = Math.floor(Math.random() * chars.length);
            randomString += chars.substring(rnum,rnum+1);
        }

        return randomString;
    };
    window.oldClass = randomString();
    window.SimpleClass = oldClass;
})();

describe('SimpleClass', function() {
    var global = window;
    var SimpleClass;

    var randomString = function() {
        var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
        var string_length = 8;
        var randomString = '';
        
        for (var i=0; i<string_length; i++) {
            var rnum = Math.floor(Math.random() * chars.length);
            randomString += chars.substring(rnum,rnum+1);
        }

        return randomString;
    };

    describe('Base Methods', function() {
        it('should provide object into global namespace', function() {
            expect(global.SimpleClass).toBeDefined();
        });
        it('should have build info', function() {
            expect(global.SimpleClass._version.build).toBeDefined();
            expect(global.SimpleClass._version.version).toBeDefined();
        });
        it('should provide an _extend method', function() {
            expect(typeof(global.SimpleClass._extend)).toEqual('function');
        });
        it('should provide a _noConflict method', function() {
            expect(typeof(global.SimpleClass._noConflict)).toEqual('function');
        });
        it('should remove the global object when noConflict is called and return itself', function() {
            SimpleClass = global.SimpleClass._noConflict();
            expect(global.SimpleClass).toEqual(oldClass);
            expect(SimpleClass._extend).toBeDefined();
        });
    });

    describe('Basic Objects', function() {
        it('should support prototypical properties', function() { 
            var myObj = SimpleClass._extend({
                name: 'obj',
                something: function() { }
            });

            expect(myObj.prototype.name).toEqual('obj');
            expect(typeof(myObj.prototype.something)).toEqual('function');

            var instance = new myObj();

            expect(instance.name).toEqual('obj');
            expect(typeof(instance.something)).toEqual('function');
        });

        it('should support static properties', function() {
            var myObj = SimpleClass._extend({
                _static: {
                    something: 'else',
                    func: function() { }
                }
            });

            expect(myObj.something).toEqual('else');
            expect(typeof(myObj.func)).toEqual('function');

            var instance = new myObj();

            expect(instance.something).not.toBeDefined();
            expect(instance.func).not.toBeDefined();
        });

        it('should support instance properties', function() {
            var myObj = SimpleClass._extend({
                _instance: {
                    something: 'else',
                    func: function() { }
                }
            });

            var instance = new myObj();

            expect(instance.something).toEqual('else');
            expect(typeof(instance.func)).toEqual('function');
        });

        it('should support simple mixin objects on the prototype', function() {
            var mixin = {
                one: 'two',
                three: function() { }
            };
            
            var myObj = SimpleClass._extend({
                _instance: {
                    something: 'else',
                    func: function() { }
                },
                _mix: [mixin]
            });

            expect(myObj.prototype.one).toEqual('two');
            expect(typeof(myObj.prototype.three)).toEqual('function');
        });

        it('should support complex mixins', function() {
            var myMixin = SimpleClass._extend({
                _instance: {
                    something: 'else'
                },
                _static: {
                    mymethod: function() { }
                },
                name: 'bob'
            });

            var myObj = SimpleClass._extend({
                _instance: {
                    one: 'two'
                },
                _static: {
                    something: 'here'
                },
                _mix: [myMixin],
                color: 'blue'
            });

            expect(myObj.mymethod).toBeDefined();
        });





    });

});
