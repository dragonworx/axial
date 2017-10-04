# Axial

Axial is a strongly typed state management framework that can be used to create objects which can be listened to when changes occur.
It is UI agnostic *(but can be integrated with most UI packages)* and is composed of the following core concepts:

* [Types](#types) - strongly type your *Interface* definitions to enhance runtime checks
* [Interfaces](#interfaces) - a definition of strongly typed properties *(can be deep/nested structures)*, can also include functions and use inheritance
* [Instances](#instances) - objects created from *Interfaces* which enforce type rules and provide events when accessed

By defining and making instances of strongly typed *Interfaces* which can contain behavior, we are ultimately building a combination of an observable **Model** AND a **Controller** in a single object.

That's about the size of it! Pretty simple core concepts, but powerful possibilities. Especially when integrated with other UI frameworks like [React](https://facebook.github.io/react/).

## Types <a name="types"></a>

*Interfaces* are strongly typed and each property can be one or more of any of the primitive types in JavaScript *(string, number, date, undefined etc)*.
You can extend those types and add additional validation logic to create custom types.
For example this allows you make numbers that can only be set between a certain range, or strings which must satisfy a regex pattern.

An *Interface* property type can be one or more of `Axial.Null`, `Axial.Undefined`, `Axial.String`, `Axial.Number`, `Axial.Boolean`, `Axial.Date`, `Axial.Regex`, `Axial.Function`, `Axial.Function`, `Axial.Object`, or `Axial.Array()`.
 
When defining arrays, you can either use the generic `Axial.Array()` or pass a specific Axial type as the argument, such as `Axial.Array(Axial.String)`, which is an array of strings.
You can even define a nested array type such as `Array.Array(Axial.Array(Axial.Number))`, which is an array of arrays of numbers.

##### Wait, what's the point of types when I have TypeScript or Flow?

[TypeScript](https://www.typescriptlang.org/) and [Flow](https://github.com/facebook/flow) both use types for static compilation checks.
Axial is using types for **runtime** checks to ensure that values passed to *Instance* setters are valid.
This isn't the same thing, so there's no duplication.
For example, you could build a library using TypeScript or Flow and compile down just fine, then have your methods fail when a consumer passes an invalid value to some method (ie. you can't control what happens at runtime via consumers without extra work).
When you use Axial, it doesn't matter what you used to compile your code, a consumer will not be able to update state with incorrect values at runtime.
This is the true value of types in Axial.

##### Extending custom types

You can extend all of the available language types to create custom types which allow you to control the way *Interface* properties are validated when values are set.

To create a custom type, just use the `Axial.<base_type>.extend()` method of the base type. The `extend()` method takes an object with specific properties, depending on the base type:

* `defaultValue` - the default value to use for a property of this type when one is not provided
* `validate` - a function which takes the value being set, and may throw an error if invalid. This will prevent the value from being set. The function does not need to return anything, only throw an error if needed.
* `min` - for `Axial.Number` types only, the minimum value which can be set
* `max` - for `Axial.Number` types only, the maximum value which can be set
* `pattern` - for `Axial.String` types only, a string or regex which the value must match

For example to extend the `Axial.Number` type to only accept numbers between 1 and 5, create a type like this:

```javascript
const CustomNumberType = Axial.Number.extend({
  min: 1,
  max: 5
});
```

You can then use the `CustomNumberType` as a property type when defining *Interface* properties ***(see below)***.

## Interfaces <a name="interfaces"></a>

An *Interface* is strongly typed definition of properties. You create *Instances* from *Interfaces*.

To define an *Interface*, just use `Axial.define()` and pass an object descriptor of the properties and their types. This object can be deeply nested if required.

```javascript
import Axial from 'axial';

// lets define a Book Interface...
const Book = Axial.define('Book', {
    title: Axial.String,
    author: Axial.String,
    releaseDate: Axial.Date,
    isAvailable: Axial.Boolean
});

// let's make an instance of the Book Interface
const book = Book.new();

// let's update a value of the Book Instance
book.title = 'A brave new world';
book.author = 123; // Axial Error thrown - value must be a string!
```

Nice, now we have an *Interface* we can create *Instances* from. If we try to update any properties with the wrong types, Axial will throw type errors.

Notice the `Book` string as the first argument?
This is optional, and can be omitted if you just want to pass the descriptor object, but it can be useful when debugging to have a name for the *Interface*.
If no name is given when defining an *Interface* then Axial will generated one.

##### Accessing Interfaces after they've been created
If you wish to access a defined Interface after it has been created/assigned you can use the static method `Axial.getInterface()` (or the shorthand `Axial.$()`) and pass in the name, or you can use the static method `Axial.Interfaces()` which will return a hash of all defined Interfaces.

```javascript
let Book = Axial.getInterface('Book');
Book = Axial.$('Book');
```

#### Nested properties

Axial allows to you to have nested properties as part of an Interface definition. For example, we might want to have nested properties in our *Book* example:

```javascript
const Book = Axial.define('Book', {
    title: Axial.String,
    author: {
        name: {
            first: Axial.String,
            last: Axial.String
        }
    },
    releaseDate: Axial.Date,
    isAvailable: Axial.Boolean
});
```

This can also be shorthanded to:

```javascript
const Book = Axial.define('Book', {
    title: Axial.String,
    'author.name.first': Axial.String,
    'author.name.last': Axial.String,
    releaseDate: Axial.Date,
    isAvailable: Axial.Boolean
});
```

Axial will auto-initialise the required nesting objects.

#### Default values and Auto-type inference

Axial provides static type references for use when defining Interfaces via `Axial.String`, `Axial.Number` etc.
These type references can be extended to create custom types which support default values. A default value is one given to an Instance property when none is initially provided.

For example, if we wanted to set a default value for the `isAvailable` boolean property of our book example, we can use the `.value()` method of any Axial type:

```javascript
const Book = Axial.define('Book', {
    title: Axial.String,
    'author.name.first': Axial.String,
    'author.name.last': Axial.String,
    releaseDate: Axial.Date,
    isAvailable: Axial.Boolean.value(true) // this will mean all new Instances have true as a default value
});
```

You can also just pass a straight value to infer the property type, and set the default value:

```javascript
const Book = Axial.define('Book', {
    title: 'untitled',
    'author.name.first': 'joe',
    'author.name.last': 'blow',
    releaseDate: Date.now(),
    isAvailable: true
});
```

These values will be used as defaults when creating new Instances of the *Book* Interface if no initial values are given.

#### Using extended types with properties

Using our *Book* example, let's add a rating property which can only be between 1-5, and a book publisher code property which must only contain letters and numbers and be 8 characters long.
We can also have a property which uses a custom function to validate the given values.

```javascript
const Book = Axial.define('Book', {
    /* ... */
    rating: Axial.Number.extend({
        min: 1,
        max: 5
    }),
    publisherCode: Axial.String.extend({
      pattern: /[a-z0-9]8}/i
    }),
    hasGoodRating () {
      return this.rating >= 3;
    }
});
```

Now if we try to set a value outside of the valid ranges, we'll cause an error.

```javascript
const book = Book.new();

// let's set some valid values
book.rating = 4; // valid
book.publisherCode = 'abcde123'; // valid
assert(book.hasGoodRating()); // true

// let's set some invalid values
book.rating = 0; // INVALID!
book.rating = 10; // INVALID!
book.publisherCode = 'asr2'; // INVALID!
book.publisherCode = 'yeh2jk-2'; // INVALID!

// check the invalid values were not overwritten
assert(book.rating === 4); // true
assert(book.publisherCode === 'abcde123'); // true
```

#### Functions as property types

You can also use functions as Interface property types. This allows you to define behavior as well as state for your Interfaces. The functions `this` context will be the Instance of the Interface.

For example, imagine we want to add a function to the *Book* Interface, to determine whether a book released this year and is popular:

```javascript
const Book = Axial.define('Book', {
    /* ... */
    isModernClassic () {
        return this.releaseDate.getFullYear() >= Date.now().getFullYear()
            && this.rating >= 4;
    }
});
```

By simply defining the function as part of the Interface object descriptor, we automatically create a function property called `isModernClassic` with a default value of the given function.

This is equivalent to:

```javascript
const Book = Axial.define('Book', {
    /* ... */
    isModernClassic: Axial.Function.value(() => {
        return this.releaseDate.getFullYear() >= Date.now().getFullYear()
            && this.rating >= 4;
    })
});
```

## Instances <a name="instances"></a>

Instances are objects created from Interfaces. Use the `.new()` method of your Interface to create an `AxialInstance`.

You can pass default values to an Instance or set them later.
Axial uses the property type information of your Interface when you attempt to set values.

Lets make an Instance of our *Book* Interface with default values:

```javascript
let book = Book.new();
assert(book.title === 'untitled'); // true
assert(book.author.name.first === 'joe'); // true
```

How about setting some default values?:

```javascript
book = Book.new({
    title: 'The Hobbit',
    author: {
        name: {
            first: 'JR',
            last: 'Tolkien'
        }
    },
    'author.name.last': 'Tolkien'
});

assert(book.title === 'The Hobbit'); // true
assert(book.author.name.first === 'JR'); // true
assert(book.author.name.last === 'Tolkien'); // true
```

Notice how we use both the nested and shorthand method of setting nested properties.

#### Checking the type of the Instance

If you want to know the type of a given Instance, access it's `<instance>.iface.id` property. This will give you the name of the Interface which the Instance was created from.

Given our book example above, we could check that the instance is actually a *Book* Interface like this:

```javascript
assert(book.iface.id === 'Book'); // true
```

#### Binding to Instance Events

Ok great, we can define Interfaces and create Instances of them...so what? - ah, this is where things get interesting!

We can bind to Axial Instances both globally and locally to listen to setter and getter operations.
This allows us to know when properties are written or read.
Local changes require a reference to the Instance, so that you can provide a handler.
Global changes mean you can listen to ANY Instance via the `Axial` object, and filter in your handler based on Instance.

Binding handlers take a single `event` argument which has the following properties:

* `method` - either `get` or `set`, when getting or setting
* `value` - the value which is being set or gotten
* `instance` - a reference to the instance, more useful for global handlers as local handlers will usually have a reference to instance

Here's an example of listening for local setter changes to our `book` instance using the `.bind()` method of `AxialInstance`:

```javascript
// step 1. bind locally to instance
book.bind('title', e => {
    console.log(`This book is: ${e.method} ${e.value}`);
});

// step 2. make changes to instance
book.title = 'J.R';
//console> The method is: "set" the title is "J.R"
```

We can also just listen to when the `book` Instance is accessed:

```javascript
// step 1. bind locally to instance
book.bind('title', e => {
    if (e.method === 'get') {
        console.log('something is accessing the title property!');
    }
});

// step 2. access instance
const title = book.title;
```

If we wanted to know when any book is accessed (without having a reference to it) we could listen globally via the `Axial` object:

```javascript
// step 1. bind globally to all instances
Axial.bind(e => {
    if (e.instance.iface.id === 'Book' && e.method === 'get') {
        console.log('something is accessing the title property of a Book!');
    }
});

// step 2. access instance
const title = book.title;
```