/*jshint smarttabs:true */
(function (root, factory) {

	"use strict";

	if (typeof exports === 'object') {
		// Node. Does not work with strict CommonJS, but
		// only CommonJS-like enviroments that support module.exports,
		// like Node.
		module.exports = factory(
			require('../node_modules/expect.js/expect.js'),
			require('../index.js')
		);
	} else if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(
			[
				'expect.js',
				'../index'
			],
			factory
		);
	} else {
		// Browser globals (root is window)
		root.returnExports = factory(
			root.expect,
			root.addEvents
		);
	}
}(this, function (
	expect,
	addEvents
) {
// =============================================================================

"use strict";

describe('addEvents',function() {
		
	it('will fire events when they occur', function(done) {
		var C = function() {};
		C.prototype.fire = function() {
			setTimeout(function() {
				this._emit('a', {b: 'c'});
			}.bind(this), 10);
		};
		addEvents(C, ['a']);
		var c = new C();
		c.on('a', function(e) {
			expect(e.b).to.equal('c');
			done();
		});
		c.fire();
	});
	
	it('can remove specific events listeners', function(done) {
		var C = function() {};
		C.prototype.fire = function() {
			setTimeout(function() {
				this._emit('a', {b: 'c'});
			}.bind(this), 10);
		};
		addEvents(C, ['a']);
		var c = new C();
		var remove = function() {
			expect().fail();
		};
		c.on('a', remove);
		c.on('a', function(e) {
			expect(e.b).to.equal('c');
			done();
		});
		c.removeListener('a', remove);
		c.fire();
	});
	
	it('can remove all events listeners for an event', function(done) {
		var C = function() {};
		C.prototype.fire = function() {
			setTimeout(function() {
				this._emit('a', {b: 'c'});
				this._emit('b', {b: 'c'});
			}.bind(this), 10);
		};
		addEvents(C, ['a', 'b']);
		var c = new C();
		c.on('a', function() {
			expect().fail();
		});
		c.on('b', function(e) {
			expect(e.b).to.equal('c');
			done();
		});
		c.removeAllListeners('a');
		c.fire();
	});
	
	it('can fire events once', function(done) {
		var calledCount = 0;
		var C = function() {};
		C.prototype.fire = function() {
			setTimeout(function() {
				this._emit('a', {b: 'c'});
			}.bind(this), 10);
		};
		addEvents(C, ['a']);
		var c = new C();
		c.once('a', function(e) {
			expect(e.b).to.equal('c');
			calledCount = calledCount + 1;
			setTimeout(function() {
				expect(calledCount).to.equal(1);
				done();
			},500);
		});
		c.fire();
		c.fire();
		c.fire();
	});
	
	it('can remove once event listeners', function(done) {
		var calledCount = 0;
		var C = function() {};
		C.prototype.fire = function() {
			setTimeout(function() {
				this._emit('a', {b: 'c'});
			}.bind(this), 10);
		};
		addEvents(C, ['a']);
		var c = new C();
		var remove = function() { expect().fail(); };
		c.once('a', remove);
		c.once('a', function(e) {
			expect(e.b).to.equal('c');
			calledCount = calledCount + 1;
			setTimeout(function() {
				expect(calledCount).to.equal(1);
				done();
			},500);
		});
		c.removeOnceListener('a', remove);
		c.fire();
		c.fire();
		c.fire();
	});
	
	it('can remove all events listeners for an event', function(done) {
		var C = function() {};
		C.prototype.fire = function() {
			setTimeout(function() {
				this._emit('a', {b: 'c'});
				this._emit('b', {b: 'c'});
			}.bind(this), 10);
		};
		addEvents(C, ['a', 'b']);
		var c = new C();
		c.once('a', function() {
			expect().fail();
		});
		c.once('b', function(e) {
			expect(e.b).to.equal('c');
			done();
		});
		c.removeAllOnceListeners('a');
		c.fire();
	});
	
	it('will snapshot event functions to fire before firing them', function(done) {
		var C = function() {};
		C.prototype.fire = function() {
			setTimeout(function() {
				this._emit('a', {b: 'c'});
			}.bind(this), 10);
		};
		addEvents(C, ['a', 'b']);
		var c = new C();
		c.once('a', function() {
			c.on('a', function() {
				expect().fail();
			})
			setTimeout(function() {
				done();
			},100)
		});
		c.fire();
	});
	
});

}));
