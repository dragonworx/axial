import React from 'react';
import ReactDOM from 'react-dom';
import Axial from '../lib/axial';

const axial1 = {
  $: {
    name: '1'
  },
  init () {
    console.log(1);
  }
};

const axial2 = {
  $: {
    name: '2'
  },
  init () {
    console.log(2);
  }
};

const axial3 = {
  $: {
    name: '3'
  },
  init () {
    console.log(3);
  }
};

class Test extends Axial.Component {
  render() {
    return (
      <div style={{border:'1px solid red', paddingLeft:'20px'}}><button onClick={() => this.set('name', 'foo')}>{this.$.name}</button>{this.props.children}</div>
    );
  }
};

class Test2 extends Test {
  constructor (props) {
    super(props);
    this.axis = axial1;
  }
};

Axial.axis = axial1;

class TodoApp extends Axial.Component {
  render() {
    return (
      <section className="todoapp">
        <Test>
          <Test2 axis={axial2}>
            <Test axis={axial3}>
              {
                this.$.name === 'foo' ? null : <Test>Last</Test>
              }
            </Test>
          </Test2>
        </Test>
      </section>
    );
  }
};

ReactDOM.render(<TodoApp />, document.getElementById('main'));