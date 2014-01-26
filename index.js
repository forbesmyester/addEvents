(function (root, factory) { // UMD from https://github.com/umdjs/umd/blob/master/returnExports.js
	"use strict";
	if (typeof exports === 'object') {
		module.exports = factory();
	} else if (typeof define === 'function' && define.amd) {
		define(factory);
	} else {
		root.addEvents = factory();
	}
})(this, function () {
	
// Author: Matthew Forrester <matt_at_keyboardwritescode.com>
// Copyright: Matthew Forrester
// License: MIT/BSD-style

"use strict";

/**
 * # addEvents()
 *
 * Adds events to an existing pseudo-classical Javascript class.
 *
 * NOTE: Overwrites the following variables within the prototype:
 *
 * * _eventTypes
 * * _emit
 * * on
 * * once
 * * removeAllListeners
 * * removeAllOnceListeners
 * * removeOnceListener
 * * removeOnceListener
 *
 * NOTE: Overwrites the following variables within the instance of a class
 *
 * * _onceListeners
 * * _listeners
 * 
 * ## Example
 *
 * ```javascript
 * var MyClass = function() {
 * };
 *
 * MyClass.prototype.doSomething = function() {
 *	return this._emit('doneit','a','b');
 * };
 *
 * addEvents(MyClass,['doneit']);
 *
 * var myClass = new MyClass();
 * myClass.on('doneit',function (a, b) {
 *	console.log('a = ' + a + ', b = ' + b);
 * });
 * myClass.doSomething();
 * ```
 *
 * ## Parameters
 * * **@param {Function} `classFunc`** The class to add events to.
 * * **@param {Array} `events`** The events you want the class to support.
 */
var addEvents = function(classFunc, events) {

	classFunc.prototype._eventTypes = events;
	
	classFunc.prototype._emit = function(event /*, other arguments */) {

		var i = 0,
			args = Array.prototype.slice.call(arguments, 1);
		
		if (this._eventTypes.indexOf(event) === -1) {
			throw "SyncIt._emit(): Attempting to fire unknown event '" + event + "'";
		}
		
		var toFire = [];
		
		if (
			this.hasOwnProperty('_onceListeners') &&
			this._onceListeners.hasOwnProperty(event)
		) {
			while (this._onceListeners[event].length) {
				toFire.push(this._onceListeners[event].shift());
			}
		}
		
		if (
			this.hasOwnProperty('_listeners') &&
			this._listeners.hasOwnProperty(event)
		) {

			for (i=0; i<this._listeners[event].length; i++) {
				toFire.push(this._listeners[event][i]);
			}
		}
		
		while (toFire.length) {
			toFire.shift().apply(this, args);
		}
		
	};

	var pushTo = function(objKey, event, func, ctx) {
		
		if (ctx._eventTypes.indexOf(event) === -1) {
			throw "addEvents: Attempting to listen for unknown event '"+event+"'";
		}
		
		if (!ctx.hasOwnProperty(objKey)) {
			ctx[objKey] = {};
		}
		
		if (!ctx[objKey].hasOwnProperty(event)) {
			ctx[objKey][event] = [];
		}
		
		ctx[objKey][event].push(func);
	};

	/**
	 * ### CLASS.on()
	 * 
	 * Adds an event listeners to an event
	 * 
	 * #### Parameters
	 * 
	 * * **@param {String} `event`** The name of the event to listen for
	 * * **@param {Function} `listener`** The listener to fire when event occurs.
	 * 
	 * #### Returns
	 * 
	 * * **@return {Boolean}** True if that event is available to listen to.
	 */
	classFunc.prototype.on = function(event, func) {
		pushTo('_listeners', event, func, this);
	};
	classFunc.prototype.listen = classFunc.prototype.on;
	
	/**
	 * ### CLASS.once()
	 * 
	 * Adds an event listeners which will be called only once then removed
	 * 
	 * #### Parameters
	 * 
	 * * **@param {String} `event`** The name of the event to listen for
	 * * **@param {Function} `listener`** The listener to fire when event occurs.
	 * 
	 * #### Returns
	 * 
	 * * **@return {Boolean}** True if that event is available to listen to.
	 */
	classFunc.prototype.once = function(event,func) {
		pushTo('_onceListeners', event, func, this);
	};
	
	var removeAllListeners = function(objKey, event, ctx) {	
		var propertyNames = (function(ob) {
			var r = [];
			for (var k in ob) { if (ob.hasOwnProperty(k)) {
				r.push(k);
			} }
			return r;
		})(ctx[objKey]);
		
		if (propertyNames.indexOf(event) == -1) {
			return [];
		}
		
		var r = ctx[objKey][event];
		ctx[objKey][event] = [];
		return r;
	};

	/**
	 * ### CLASS.removeAllListeners()
	 *
	 * Removes all non `once` listeners for a specific event.
	 *
	 * #### Parameters
	 * 
	 * * **@param {String} `event`** The name of the event you want to remove all listeners for.
	 * 
	 * #### Returns
	 * 
	 * * **@return {Array}** The listeners that have just been removed.
	 */
	classFunc.prototype.removeAllListeners = function(event) {
		return removeAllListeners('_listeners', event, this);
	};
	
	/**
	 * ### CLASS.removeAllOnceListeners()
	 *
	 * Removes all `once` listeners for a specific event.
	 *
	 * #### Parameters
	 * 
	 * * **@param {String} `event`** The name of the event you want to remove all listeners for.
	 * 
	 * #### Returns
	 * 
	 * * **@return {Array}** The listeners that have just been removed.
	 */
	classFunc.prototype.removeAllOnceListeners = function(event) {
		return removeAllListeners('_onceListeners', event, this);
	};
	
	var removeListener = function(objKey, event, listener, ctx) {
		
		var i = 0,
			replacement = [],
			successful = false;
		
		var propertyNames = (function(ob) {
			var r = [];
			for (var k in ob) { if (ob.hasOwnProperty(k)) {
				r.push(k);
			} }
			return r;
		})(ctx[objKey]);
		
		if (propertyNames.indexOf(event) == -1) {
			return false;
		}
		
		for (i=0; i<ctx[objKey][event].length; i++) {
			if (ctx[objKey][event][i] !== listener) {
				replacement.push(ctx[objKey][event][i]);
			} else {
				successful = true;
			}
		}
		ctx[objKey][event] = replacement;
		
		return successful;
	};
	
	/**
	 * ### CLASS.removeListener()
	 *
	 * Removes a specific listener from an event (note, not from the `once()` call).
	 *
	 * #### Parameters
	 * 
	 * * **@param {String} `event`** The name of the event you want to remove a listener from.
	 * * **@param {Function} `listener`** The listener you want to remove.
	 * 
	 * #### Returns
	 * 
	 * * **@return {Boolean}** True if the listener was removed, false otherwise.
	 */
	classFunc.prototype.removeListener = function(event, listener) {
		return removeListener('_listeners', event, listener, this);
	};

	/**
	 * ### CLASS.removeOnceListener()
	 *
	 * Removes a specific listener from an event (note, not from the `once()` call).
	 *
	 * #### Parameters
	 * 
	 * * **@param {String} `event`** The name of the event you want to remove a listener from.
	 * * **@param {Function} `listener`** The listener you want to remove.
	 * 
	 * #### Returns
	 * 
	 * * **@return {Boolean}** True if the listener was removed, false otherwise.
	 */
	classFunc.prototype.removeOnceListener = function(event, listener) {
		return removeListener('_onceListeners', event, listener, this);
	};

};

return addEvents;

});