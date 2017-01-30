var gulp = require('gulp');
var webpack = require('gulp-webpack');
var path = require('path');

var publishPath = path.resolve('./test/lib');

gulp.task('webpack-test', function() {
  return gulp.src('./test/test.js')
    .pipe(webpack({
      entry: './test/test.js',
      output: {
        path: publishPath,
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
    .pipe(gulp.dest(publishPath));
});

gulp.task('test:watch', function () {
  gulp.watch(['./lib/*.js', './test/*.js'], ['webpack-test']);
});

gulp.task('default', ['webpack-test', 'test:watch']);