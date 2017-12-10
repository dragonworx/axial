import React from 'react';
import ReactDOM from 'react-dom';
import Axial from '../../lib/axial';
import { asScope } from '../../lib/state';

export { React, ReactDOM, Axial };

export class AxialComponent extends Axial.Component {
  render() {
    const { expect, source, title } = this.props;
    const { name } = this;
    const passed = name === expect;
    return (
      <section className={`scope ${passed ? 'pass' : 'fail'}`}>
        {title ? <div className="title">{title}</div> : null}
        <label>
          <span className="name">"{name}"</span> <span className="source">"{source}"</span>
          {passed ? null : <span>expect: "{expect}"</span>}
        </label>
        {this.props.children}
        <button onClick={this.onClick}>
          "{name}" clicks: {this.clicks}
        </button>
      </section>
    );
  }

  get onClick () {
    return () => this.clicks++;
  }
};

export function createExampleScope (name) {
  const scope = {
    name: name,
    clicks: 0,
    init () {
      console.log(`${name} init`);
    }
  };
  return Axial[name] = asScope(scope);
}