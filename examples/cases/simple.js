import { React, ReactDOM, Axial } from './common';

Axial.axis = {
  $: {
    name: 'Simple',
    clicks: 0
  },
  init () {
    console.log('simple init');
  }
};

class Simple extends Axial.Component {
  render($) {
    return (
      <p>
        <button onClick={() => this.set($ => $.clicks++)}>
          {$.name} - {$.clicks} clicks
        </button>
      </p>
    );
  }
};

ReactDOM.render(<Simple />, document.getElementById('main'));