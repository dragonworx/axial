Todo Changes: 2.1

* use getters/setters instead of this.set(...):

```
// before
this.set('foo', 3);

// after
this.foo = 3;
```


define axis like:
```
// object literal
const scope = {
  foo: 0,

  init () {
    this.foo = 5;
  }
};

// es6 class
class scope {
  foo = 0;

  init () {
    this.foo = 5;
  }
}
```

axis uses scopes, which can be defined as a global like:

```
Axis.scope = scope;
```

or nested, and pushed/poped as React child components are rendered so peek of scope is used by component render function.

global scope is first scope set. if components weren't passed one as a prop then they peek() scope stack.
if they were passed a scope via props then when componentWillMount() push() that scope onto the stack.
  then when componentDidUnmount() pop() the scope from the stack.

A component gets its scope from either:
* peek() scope - by default, there should be at least one scope set before a component is rendered in order to get immediate data
* passed as a prop - when you are composing components you can mark an area of your view composition to use a particular scope
