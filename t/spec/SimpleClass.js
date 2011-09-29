window.SimpleClass = 'test';
describe('SimpleClass', function() {
    var global = window;
    var SimpleClass;

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
        it('should remove the global object when noConflict is called', function() {
            SimpleClass = global.SimpleClass._noConflict();
            expect(global.SimpleClass).toEqual('test');
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
        });

    });

});
