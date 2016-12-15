# Axial
Centralised application state and behaviour.

Axial is a stand alone library for managing application state and behavior.

# Simple, Fast, Fun.

> **NOTE** This library is under development and will be available soon. The current version is not stable and does not provide any documentation. Please wait for an update soon to start using!

## Central State

When using Axial your application reads and writes state data in one place, and when that state changes your application is notified.

Think of your application state as a tree of key value properties. You use the dot-notation to address the state.
When you want write state you use `Axial.set()` and when you want to read state you use `Axial.get()`.

You can store any values as state, though since most JavaScript applications deal with JSON, it's recommended you use primitive types like `String`, `Number`, `Boolean`, `Object{}`, and `Array[]` to make serialisation easier. 

To start using Axial let's initialise our application with some default state. For the sake of a simple example, we'll use short property names `a`, `b`, `c`, `d`, `e`: 

```
import Axial from 'axial'

Axial.set({
    a: {
        b: [1, 2, 3],
        c: 5,
        d: {
            e: 'foo' 
        }
    },
    f: true
});
```

Axial deals with paths, which are dot-syntax strings that reference the data.
For example the path to access the value `foo` in this example would be `a.d.e`.

## Reading State

If we want to read a state value we use `Axial.get()`. For example we can read from the state like this:

```
Axial.get('a')      // -> [object Object]
Axial.get('a.b')    // -> [1, 2, 3]
Axial.get('a.c')    // -> 5
Axial.get('a.d')    // -> [object Object]
Axial.get('a.d.e')  // -> 'foo'
Axial.get('f')      // -> true
```

By default Axial will return `undefined` for any path which does not exist. If you want stricter functionality, pass `true` as the second argument to `.get()`, and Axial will throw an error if the path is not found.
 
```
// pass true to throw errors when path not found
try {
    Axial.get('this.path.does.not.exist', true);
} catch (e) {
    // we know that the path does not exist or has `undefined` as a value
}
```

## Writing State

If we want to update the state we can use `Axial.set()` with a path and value:

```
Axial.set('a.d.e', 'bar');
```

Or we can pass an object with nested properties for batch updating:
```
Axial.set({
    a: {
        d: {
            e: 'bar'
        }
    }
});
```

Axial will automatically initialise missing objects in a given path, to speed up defining state structure

```
// set default empty state
Axial.set({});

// now set a deep path which doesn't exist
Axial.set('a.b.c', true);

// take a look, the objects were automatically created!
Axial.get('a')      // -> [object Object]
Axial.get('a.b')    // -> [object Object]
Axial.get('c')      // -> true 
```

## Listening for state changes
So how do we know stuff changes? We hook up an event listener which listens to a specific leaf or branch path:

```
Axial.on('a.d.e', e => {
    console.log(e);
});
```

If we now modify the state data at path `a.d.e` from `true` to `false` we will see this console output:

```
Axial.set('a.d.e', false);

>> {type:"set", path:"a.d.e", value:"false"}
```

We can also listen to changes from a certain path onwards, for example if we wanted to know when anything changes in the `a.*` path we can simply listen like this: