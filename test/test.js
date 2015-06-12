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
		path: __dirname + '/test/working.html',
		contents: new Buffer('<div id="working"><label for="has-label">Label for this text field.</label><input type="text" id="has-label"></div>')
	}));

	stream.end();
});


xit('should not pass the a11y validation', function (cb) {
	var stream = axeCore();

	stream.on('data', function (results) {
		assert.not.equal(0, results.violation.length);
	});

	stream.on('end', cb);

	stream.write(new gutil.File({
		base: __dirname,
		path: __dirname + '/test/broken.html',
		contents: new Buffer('<div id="broken"><p>Not a label</p><input type="text" id="no-label"><p>Not an alt</p><img src="foobar.gif"></div>')
	}));

	stream.end();
});
