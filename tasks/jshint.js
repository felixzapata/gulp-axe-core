'use strict';
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var stylish = require('jshint-stylish');
var options = {
    lookup: true
  };


gulp.task('jshint', function() {
    var options = {
        lookup: true
    };
    return gulp.src([
            'gulpfile.js',
            'index.js',
            '<%= nodeunit.tests %>'
        ])
        .pipe($.jshint(options))
        .pipe($.jshint.reporter(stylish));
});
