import { React, ReactDOM, Axial } from './cases/common';

// 1. import cases
import simple from './cases/simple';
import constructor from './cases/constructor';
import getter from './cases/getter';
import props from './cases/props';
import global from './cases/global';
import simple_nested from './cases/simple_nested';

// 2. register cases
const cases = {
  simple,
  constructor,
  getter,
  props,
  global,
  simple_nested
};

// show build hash
const info = document.querySelector('#info');
info.innerHTML = __webpack_hash__;
const buildHash = location.search.match(/build=(.*)/);
if (buildHash) {
  // check last build to current to determine showing ready style
  if (__webpack_hash__ !== buildHash[1]) {
    info.classList.add('build-ready');
    setTimeout(() => info.classList.remove('build-ready'), 5000);
  }
}

// set url build param
history.pushState({}, document.title, `?build=${__webpack_hash__}`);

// build cases menu
const tabs = document.getElementById('tabs');
let html = '';
Object.keys(cases).forEach(key => {
  html += `<li><button data-case="${key}">${key}</button></li>`;
});
tabs.innerHTML = html;

document.querySelectorAll('#main header button').forEach(el => {
  el.addEventListener('click', e => {
    const caseKey = el.getAttribute('data-case');
    console.group(caseKey);
    const Example = cases[caseKey];
    console.clear();
    Example.begin();
    ReactDOM.render(<Example />, document.getElementById('example'));
    console.groupEnd();
  });
});

export default Axial;