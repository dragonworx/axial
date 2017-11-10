
module.exports = {
  
    testRegex: '\\/lib\\/.*(\\.spec)\\.jsx?$',
    moduleFileExtensions: ['js', 'jsx'],
  
    transform: {
      '^.+\\.jsx?$': 'babel-jest'
    },
  
    moduleNameMapper: {
      '\\.(css|less)$': 'identity-obj-proxy',
  
      // we're using Webpack's raw-loader to import a module as text (instead of evaluating it) and
      //  creating an "inline" Worker... Jest doesn't understand Webpack loaders so we need to tell it
      //  to do something with it - in this case we replace it with an empty string since
      //  Workers don't exist in jsdom anyway.
      '^raw-loader!../../../node_modules/rusha/rusha.js$': '<rootDir>/jest/rawLoaderMock.js',
    },
  
    setupFiles: [
      '<rootDir>/jest/setup.js'
    ],
  
    globals: {

    },
  
    mapCoverage: true,
  
  };
  