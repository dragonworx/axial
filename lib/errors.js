let Errors = {
  AxialNotImplemented: () => `(<AxialNot></AxialNot>Implemented) This method is unimplemented...tsk tsk!`,
  AxialInvalidType: (expected, given) => `(AxialInvalidType) Invalid type, "${expected}" expected, "${given}" given`,
  AxialPathNotFound: (path) => `(AxialPathNotFound) Path not found "${path}"`,
  AxialListenerNotFound: () => `(AxialListenerNotFound) The listener is not attached`,
  AxialSchemaPathExists: (path) => `(AxialSchemaPathExists) Path already exists "${path}"`,
  AxialUndefinedType: (type) => `(AxialUndefinedType) Type not found "${type}"`,
  AxialInvalidPath: (path, reason) => `(AxialInvalidPath) Path invalid ${path} - "${reason}"`,
};

export default Errors;