'use strict';
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

gulp.task('test', ['jshint'], function () {
    return gulp.src('test.js', {cwd: './test', read: false})
        .pipe($.mocha());
});
