# Axial

## Interfaces and Instances

How do you ensure that the operations you perform on your data at runtime are safe? Define you data using interfaces of course!

You can think of interfaces like classes. All of the properties are strongly typed, and can be of multiple types or required if needed (default is not required).

Axial lets you define your interfaces using the `Axial.define()` method:

```
const Book = Axial.define({
    title: Axial.String,
    author: Axial.String,
    yearPublished: Axial.Date
});
```

You can then make instances of your interface, with or without default values:

```
const book1 = Book.new();
const book2 = Book.new({
    title: 'Harry Potter',
    author: 'Jenkins',
    yearPublished: new Date()
});
```

Axial will throw errors if you use the wrong types: