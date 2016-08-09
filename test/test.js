'use strict';

var pluginPath = '../index';
var axeCore = require(pluginPath);
var gulp = require('gulp');
var path = require('path');
var should = require('should');
var assert = require('assert');
var sassert = require('stream-assert');
require('mocha');

var fixtures = function(glob) { return path.join(__dirname, './fixtures', glob); }

describe('gulp-axe-core', function() {

	this.timeout(5000);

	it('should pass the a11y validation', function (done) {
			gulp.src(fixtures('working.html'))
				.pipe(axeCore())
				.pipe(sassert.end(done));
	});


	it('should not pass the a11y validation', function (done) {
			gulp.src(fixtures('broken.html'))
				.pipe(axeCore())
				.pipe(sassert.end(done));
	});

	it('should create JSON file with the results', function (done) {
		var options = {
			saveOutputIn: 'allHtml.json'
		};
		gulp.src(fixtures('broken.html'))
				.pipe(axeCore(options))
				.pipe(sassert.end(function() {
					var expected = fs.readFileSync(path.join(__dirname,'allHtml.json')).toString();
					expected.should.not.be('');
					done();
				}));
	});

});