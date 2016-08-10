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
	
	var output;
	var write = process.stdout.write;

	beforeEach(function(done) {
    var folder = path.join(__dirname, 'temp');
		output = '';
    process.stdout.write = function(str) {
      output += str;
    };
    fs.remove(folder, done);
	});

	afterEach(function() {
    process.stdout.write = write;
  });

	it('should pass the a11y validation', function (done) {
			gulp.src(fixtures('working.html'))
				.pipe(axeCore())
				.pipe(sassert.end(function() {
					assert.equal(output.match(/Found 1 accessibility violations/gi).length, 1);
					assert.equal(output.match(/(File to test|test\/fixtures\/working.html)/gi).length, 2);
					done();
				}));
	});


	it('should not pass the a11y validation', function (done) {
			gulp.src(fixtures('broken.html'))
				.pipe(axeCore())
				.pipe(sassert.end(function() {
					assert.equal(output.match(/Found 1 accessibility violations/gi).length, 1);
					assert.equal(output.match(/(File to test|test\/fixtures\/broken.html)/gi).length, 2);
					done();
				}));
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