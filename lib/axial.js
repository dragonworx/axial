import Types from './types'
import Errors from './errors'
import util from './util'
import state from './state'
import AxialComponent from './component'

let Axial = {
  Errors: Errors,
  Component: AxialComponent,
  util: util,
  define: state.define,
  schema: state.schema,
  state: state.state
};

util.merge(Axial, Types);

module.exports = Axial;