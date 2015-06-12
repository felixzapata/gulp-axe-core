'use strict';
var assert = require('assert');
var gutil = require('gulp-util');
var axeCore = require('../');

it('should pass the a11y validation', function (cb) {
	var stream = axeCore();

	stream.on('data', function (results) {
		assert.equal(0, results.violation.length);

	});

	stream.on('end', cb);

	stream.write(new gutil.File({
		base: __dirname,
		path: __dirname + '/test/fixtures/working.html'
	}));

	stream.end();
});


it('should not pass the a11y validation', function (cb) {
	var stream = axeCore();

	stream.on('data', function (results) {
		assert.not.equal(0, results.violation.length);
	});

	stream.on('end', cb);

	stream.write(new gutil.File({
		base: __dirname,
		path: __dirname + '/test/fixtures/broken.html'
	}));

	stream.end();
});
