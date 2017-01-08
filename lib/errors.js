let Errors = {
  AxialNotImplemented: () => `(AxialNotImplemented) This method is unimplemented...tsk tsk!`,
  AxialInvalidType: (expected, given) => `(AxialInvalidType) Invalid type, "${expected}" expected, "${given}" given`,
  AxialPathNotFound: (path) => `(AxialPathNotFound) Path not found "${expected}"`,
  AxialListenerNotFound: () => `(AxialListenerNotFound) The listener is not attached`,
  AxialSchemaPathExists: (path) => `(AxialSchemaPathExists) Path already exists "${path}"`,
  AxialUndefinedType: (type) => `(AxialUndefinedType) Type not found "${type}"`,
};

module.exports = Errors;