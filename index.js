'use strict';
var gutil = require('gulp-util');
var vm = require('vm');
var fs = require('fs');
var through = require('through2');
var cheerio = require('cheerio');
var DOMParser = require('xmldom').DOMParser;
var context;
//var axe = require(__dirname + '/node_modules/axe-core/axe.min.js');
var axe = require('axe-core');

//vm.runInThisContext(fs.readFileSync(__dirname + '/node_modules/axe-core/axe.js'));

//vm.runInThisContext(axe);

module.exports = function (options) {
	/*if (!options.foo) {
		throw new gutil.PluginError('gulp-axe-core', '`foo` required');
	}*/
	

	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			cb(null, file);
			return;
		}
		if (file.isStream()) {
			cb(new gutil.PluginError('gulp-axe-core', 'Streaming not supported'));
			return;
		}

		try {

			//context = cheerio.load(file.contents.toString());
			//context = file.contents.toString();
			context = new DOMParser().parseFromString(file.contents.toString(), 'text/html');

			//file.contents = new Buffer(axe.a11yCheck(context.firstChild, options));
			//this.push(file);

			//console.log(context.documentElement.attributes['0'].ownerDocument)

			//console.log(context);

			axe.a11yCheck(context, null, function(result) {
				console.log(result);
			});

		} catch (err) {
			this.emit('error', new gutil.PluginError('gulp-axe-core', err));
		}

		cb();
	});
};
