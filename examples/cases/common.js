import React from 'react';
import ReactDOM from 'react-dom';
import Axial from '../../lib/axial';
import { scope_ref } from '../../lib/state';

export { React, ReactDOM, Axial };

export class AxialComponent extends Axial.Component {
  render() {
    const { expect, source, title } = this.props;
    const { id } = this;
    const passed = id === expect;
    const r = Math.round(Math.random() * 255);
    const g = Math.round(Math.random() * 255);
    const b = Math.round(Math.random() * 255);

    return (
      <section className={`scope ${passed ? 'pass' : 'fail'}`} style={{backgroundColor:`rgb(${r},${g},${b})`}}>
        {title ? <div className="title">{title}</div> : null}
        <label>
          <span className="id">id: "{id}"</span> <span className="source">source: "{source}"</span>
          {passed ? null : <span>expect: "{expect}"</span>}
        </label>
        {this.props.children}
        <button onClick={this.onClick}>
        "{id}" clicks: {this.clicks}
      </button>
      </section>
    );
  }

  get onClick () {
    return () => this.clicks++;
  }
};

export class AxialNestedComponent extends Axial.Component {
  render() {
    const { expect, source, title } = this.props;
    const { id, foo: {clicks} } = this;
    const passed = id === expect;
    const r = Math.round(Math.random() * 255);
    const g = Math.round(Math.random() * 255);
    const b = Math.round(Math.random() * 255);
    return (
      <section className={`scope ${passed ? 'pass' : 'fail'}`} style={{backgroundColor:`rgb(${r},${g},${b})`}}>
        {title ? <div className="title">{title}</div> : null}
        <label>
          <span className="id">id: "{id}"</span> <span className="source">source: "{source}"</span>
          {passed ? null : <span>expect: "{expect}"</span>}
        </label>
        {this.props.children}
        <button onClick={this.onClick}>
          "{id}" clicks: {this.clicks}
        </button>
        &nbsp;
        <button onClick={() => this.foo.clicks++}>
          "{this.foo.clicks}" nested_clicks: "{this.foo.text()}"
        </button>
      </section>
    );
  }

  get onClick () {
    return () => this.clicks++;
  }
}

export function createExampleScope (id) {
  return Axial[id] = {
    id: id,
    clicks: 0,
    init () {
      console.log(`${id} init`);
    }
  };
}

export function createNestedExampleScope (id) {
  return Axial[id] = {
    id: id,
    clicks: 0,
    init () {
      console.log(`${id} init`);
    },
    foo: {
      id: 'foo',
      clicks: 10,
      text () {
        return `${this.id}`;
      },
      array: [{
        x: {
          y: 1
        }
      }, true]
    }
  };
}