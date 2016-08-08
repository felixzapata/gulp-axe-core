'use strict';

var pluginPath = '../index';
var axecore = require(pluginPath);
var gulp = require('gulp');
var fs = require('fs-extra');
var path = require('path');
var should = require('should');
var assert = require('assert');
var sassert = require('stream-assert');
require('mocha');

var fixtures = function(glob) { return path.join(__dirname, './fixtures', glob); }

describe('gulp-axe-core', function() {

	it('should pass the a11y validation', function (done) {
			gulp.src(fixtures('working.html'))
				.pipe(axecore())
				.pipe(sassert.first(function(d) {
					
				}))
		.pipe(sassert.end(done));
	});


	xit('should not pass the a11y validation', function (done) {
		gulp.src(fixtures('broken.html'))
				.pipe(axecore())
				.pipe(sassert.first(function(d) {
					
				}))
		.pipe(sassert.end(done));
	});

});