'use strict';

var pluginPath = '../index';
var axeCore = require(pluginPath);
var gulp = require('gulp');
var path = require('path');
var fs = require('fs-extra');
var should = require('should');
var assert = require('assert');
var sassert = require('stream-assert');
require('mocha');

var fixtures = function(glob) { return path.join(__dirname, './fixtures', glob); }

function fileExists(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch (err) {
    return false;
  }
}

describe('gulp-axe-core', function() {

	this.timeout(5000);

	beforeEach(function(done) {
    var folder = path.join(__dirname, 'temp');
    fs.remove(folder, done);
	});

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
			saveOutputIn: 'allHtml.json',
			folderOutputReport: path.join(__dirname, 'temp')
		};
	
		gulp.src(fixtures('broken.html'))
				.pipe(axeCore(options))
				.pipe(sassert.end(function() {
					var expected = path.join(__dirname, 'temp', 'allHtml.json');
					fileExists(expected).should.equal(true);
					done();
				}));
	});

});