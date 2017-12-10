const webpack = require('webpack');

function config (opts) {
  return {
    entry: opts.entry,
    output: {
      filename: opts.filename,
      path: opts.path || __dirname + '/dist',
      libraryTarget: 'umd',
      libraryExport: 'default',
      library: 'Axial'
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          query: {
            presets: ['es2015', 'react']
          }
        }
      ]
    },
    stats: {
      colors: true
    },
    devtool: 'source-map',
    plugins: opts.plugins || [],
    externals: opts.externals || {}
  };
}

const configs = {
  'development': {
    filename: 'axial.js',
    entry: './lib/axial.js',
    externals: {
      react: 'react'
    }
  },
  'production': {
    filename: 'axial.min.js',
    entry: './lib/axial.js',
    externals: {
      react: 'react'
    },
    plugins: [ new webpack.optimize.UglifyJsPlugin({ sourceMap: true }) ]
  },
  'examples': {
    filename: 'examples.js',
    entry: './examples/index.js',
    plugins: [ new webpack.ExtendedAPIPlugin() ],
    path: __dirname + '/examples/js'
  }
};

const builds = ['development', 'production', 'examples'];

module.exports = builds.map(name => config(configs[name]));