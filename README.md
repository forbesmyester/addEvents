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

## Loading

index.js is the source code and is compatible with [browserify](http://browserify.org/). index.umd.js was built as a standalone UMD package (without minification) so you can use it with AMD or a normal browser environment... The exported global is the name of the package within package.json (with hyphens etc removed).
 
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
