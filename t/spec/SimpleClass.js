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
        it('should be extendable', function() {
            var myObj = SimpleClass._extend();
            expect(typeof(myObj._extend)).toEqual('function');
        });
        
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
            expect(myObj.something).toBeDefined();

            var instance = new myObj();

            expect(instance.something).toBeDefined();
            expect(instance.one).toBeDefined();
        });

        it('should call a constructor if one is provided', function() {
            var called_init = false;

            var myObj = SimpleClass._extend({
               _init: function() {
                   called_init = true;
               }
            });

            var instance = new myObj();
            expect(called_init).toBeTruthy();
        });

        it('should have a superClass property', function() {
            var myObj = SimpleClass._extend();
            expect(myObj.prototype._superClass).toBeDefined();
        });

    });

    describe('Basic Inheritance', function() {
            it('objects should be able to be extended', function() {
                var myObj = SimpleClass._extend({
                    _instance: {
                        one: 'two'
                    },
                    _static: {
                        something: 'here'
                    },
                    color: 'blue'
                });

                var child = myObj._extend({
                    _instance: {
                        three: 'four'
                    },
                    _static: {
                        stuff: 'here'
                    },
                    type: 'fun'
                });
                
                // static properties
                expect(child.something).toBeDefined();
                expect(child.stuff).toBeDefined();

                var instance = new child();
                
                // instance properties
                expect(instance.three).toBeDefined();
                expect(instance.one).toBeDefined();
                
                // instance prototype
                expect(instance.color).toBeDefined();
                expect(instance.type).toBeDefined();
            });

            it('multiple inheritance should work', function() {
                var first = SimpleClass._extend({
                    _instance: {
                        one: 'two'
                    },
                    _static: {
                        something: 'here'
                    },
                    color: 'blue'
                });

                var second = first._extend({
                    _instance: {
                        three: 'four'
                    },
                    _static: {
                        stuff: 'here'
                    },
                    really: 'fun'
                });

                var third = second._extend({
                    _instance: {
                        five: 'six'
                    },
                    _static: {
                        more: 'yes'
                    },
                    type: 'great'
                });

                // static properties
                expect(third.something).toBeDefined();
                expect(third.stuff).toBeDefined();
                expect(third.more).toBeDefined();

                var instance = new third();

                // instance properties
                expect(instance.three).toBeDefined();
                expect(instance.one).toBeDefined();
                expect(instance.five).toBeDefined();

                // prototype properties
                expect(instance.color).toBeDefined();
                expect(instance.type).toBeDefined();
                expect(instance.really).toBeDefined();

            });

            it('defined class prototype should be accessible', function() {
                var first = SimpleClass._extend({
                    name: 'first',
                    getName1: function() {
                        return this._class.name;
                    },
                    getCurrentName: function() {
                        return this.name;
                    }
                });

                var second = first._extend({
                    name: 'second',
                    getName2: function() {
                        return this._class.name;
                    }
                });

                var instance = new second();
                expect(instance.getName1()).toEqual('first');
                expect(instance.getName2()).toEqual('second');
                expect(instance.getCurrentName()).toEqual('second');

            });

            it('defined class prototype should be accessible in decendant classes', function() {
                var A = SimpleClass._extend({
                    name: 'I am class A',
                    getName: function() {
                        return this._class.name;
                    }
                });

                var B = A._extend({
                    name: 'I am class B',
                    getName: function() {
                        return this._class.name;
                    }
                });

                var C = B._extend({
                    name: 'I am class C',
                    getParentName: function() {
                        return this._superClass.getName();
                    },
                    getGrandparentName: function() {
                        return this._superClass._superClass.getName();
                    },
                    getName: function() {
                        return this._class.name;
                    }
                });

                var instance = new C();
                expect(instance.getName()).toEqual('I am class C');
                expect(instance.getParentName()).toEqual('I am class B');
                expect(instance.getGrandparentName()).toEqual('I am class A');
            });

            it('parent class methods should be able to be called and understand their this value', function() {
                var called_parent = false;
                var called_child  = false;

                var first = SimpleClass._extend({
                    _instance: {
                        one: 'two'
                    },
                    _static: {
                        something: 'here'
                    },
                    color: 'blue',
                    setColor1: function() {
                        this.color = 'blue';
                    }
                });

                var second = first._extend({
                    _instance: {
                        color: 'none'
                    },
                    _static: {
                        stuff: 'here'
                    },
                    setColor1: function() {
                        this.origColor = 'green';
                        this._super();
                    },
                    setColor2: function() {
                        this.color = 'pink';
                    }
                });

                var instance = new second();
                expect(instance.color).toEqual('none');
                instance.setColor1();
                expect(instance.color).toEqual('blue');
                expect(instance.origColor).toEqual('green');
                instance.setColor2();
                expect(instance.color).toEqual('pink');

            });
        
            it('mixed objects should be inherited', function() {
                var mix = {
                    hello: function() { },
                    goodbye: function() { }
                };

                var mix2 = {
                    other: function() { },
                    another: function() { }
                };

                var mix3 = {
                    hey: function() { },
                    who: function() { }
                };

                var mix4 = {
                    great: 'nice',
                    awesome: 'person'
                };
                
                var first = SimpleClass._extend({
                    _instance: {
                        one: 'two'
                    },
                    _static: {
                        something: 'here'
                    },
                    _mix: [mix],
                    color: 'blue'
                });

                var second = first._extend({
                    _instance: {
                        three: 'four'
                    },
                    _static: {
                        stuff: 'here'
                    },
                    _mix: [mix2, mix3],
                    really: 'fun'
                });

                var third = second._extend({
                    _instance: {
                        five: 'six'
                    },
                    _static: {
                        more: 'yes'
                    },
                    _mix: [mix4],
                    type: 'great'
                });

                var instance1 = new second();
                var instance2 = new third();
                
                expect(typeof(instance1.hello)).toEqual('function');
                expect(typeof(instance1.goodbye)).toEqual('function');

                expect(typeof(instance1.hey)).toEqual('function');
                expect(typeof(instance1.who)).toEqual('function');

                expect(typeof(instance2.hello)).toEqual('function');
                expect(typeof(instance2.goodbye)).toEqual('function');
            });

            it('mixed complex classes should be inherited', function() {
                var mixed1 = SimpleClass._extend({
                    _instance: {
                        hello: 'test'
                    },
                    _static: {
                        one: 'two'
                    },
                    people: true
                });

                var mixed2 = SimpleClass._extend({
                    _instance: {
                        date: 'today',
                    },
                    _static: {
                        something: 'yes'
                    },
                    canWalk: false
                });

                var person = SimpleClass._extend({
                    _instance: {
                        myvar: 'something'
                    },
                    _static: {
                        two: 'three'
                    },
                    _mix: [mixed1, mixed2],
                    greg: false
                });

                expect(person.one).toEqual('two');
                expect(person.two).toEqual('three');
                expect(person.something).toEqual('yes');
                
                var instance = new person();
                
                expect(instance.hello).toEqual('test');
                expect(instance.myvar).toEqual('something');
                expect(instance.people).toBeTruthy();
                expect(instance.greg).toBeFalsy();
                expect(instance.date).toEqual('today');
                expect(instance.canWalk).toBeDefined();
            });

            it('mixed complex classes with inheritance should be able to be mixed themselves', function() {
                

            });
            

    });

});
