# addEvents()

Adds events to an existing pseudo-classical Javascript class.

NOTE: Overwrites the following variables within the prototype:

 * _eventTypes
 * _emit
 * on
 * once
 * removeAllListeners
 * removeAllOnceListeners
 * removeOnceListener
 * removeOnceListener

NOTE: Overwrites the following variables within the instance of a class

 * _onceListeners
 * _listeners

## Source Code

Source code is prepared using [Browserify](http://browserify.org/) which is also compatible with Node.JS. There is a UMD bundle which can be used with AMD or a vanilla browser (where it will export a global called called addEvents.
 
## Example

```javascript
var MyClass = function() {
};

MyClass.prototype.doSomething = function() {
	return this._emit('doneit','a','b');
};

addEvents(MyClass,['doneit']);

var myClass = new MyClass();
myClass.on('doneit',function (a, b) {
	console.log('a = ' + a + ', b = ' + b);
});

myClass.doSomething();
```

## Parameters
 * **@param {Function} `classFunc`** The class to add events to.
 * **@param {Array} `events`** The events you want the class to support.
