var gulp = require('gulp');
var webpack = require('gulp-webpack');
var path = require('path');

var distPath = path.resolve('./dist');

gulp.task('webpack-build', function() {
  gulp.src('./index.js')
    .pipe(webpack({
      entry: './index.js',
      output: {
        path: distPath,
        filename: 'axial.js'
      },
      devtool: 'source-map',
      module: {
        loaders: [
          {
            test: /.jsx?$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            query: {
              presets: ['es2015', 'react']
            }
          }
        ]
      }
    }))
    .pipe(gulp.dest(distPath));
});

gulp.task('webpack-test', function() {
  gulp.src('./test/test.js')
    .pipe(webpack({
      entry: './test/test.js',
      output: {
        path: distPath,
        filename: 'test.js'
      },
      devtool: 'source-map',
      module: {
        loaders: [
          {
            test: /.jsx?$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            query: {
              presets: ['es2015', 'react']
            }
          }
        ]
      }
    }))
    .pipe(gulp.dest(distPath));
});

gulp.task('test:watch', function () {
  gulp.watch(['./lib/*.js', './test/*.js'], ['webpack-test']);
});

gulp.task('default', ['webpack-build']);
gulp.task('dev', ['default', 'test:watch']);