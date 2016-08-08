'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var AxeBuilder = require('axe-webdriverjs');
var WebDriver = require('selenium-webdriver');
var PLUGIN_NAME = 'gulp-axe-core';

var driver = new WebDriver.Builder()
  .forBrowser('firefox')
  .build();

module.exports = function (options) {

	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			cb(null, file);
			return;
		}
		if (file.isStream()) {
			cb(new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
			return;
		}

		try {

			driver
				.get(file.path)
				.then(function () {
					AxeBuilder(driver)
						.analyze(function (results) {
							console.log(results);
						});
				});

		} catch (err) {
			this.emit('error', new gutil.PluginError(PLUGIN_NAME, err));
		}

		cb();
	});
};
