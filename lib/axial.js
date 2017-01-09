import Types from './types'
import Errors from './errors'
import util from './util'
import AxialSchema from './schema'
import AxialComponent from './component'

let Axial = {
  Errors: Errors,
  Component: AxialComponent,
  util: util,
  define: function (definitions) {
    return new AxialSchema(definitions);
  },
  defineType: function (name, definitions) {
    return Types.Custom._define(name, new AxialSchema(definitions));
  }
};

util.merge(Axial, Types);

module.exports = Axial;