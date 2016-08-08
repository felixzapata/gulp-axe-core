'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var path = require('path');
var fileUrl = require('file-url');
var AxeBuilder = require('axe-webdriverjs');
var WebDriver = require('selenium-webdriver');
var Promise = require('promise');
var PLUGIN_NAME = 'gulp-axe-core';

var driver = new WebDriver.Builder()
  .forBrowser('firefox')
  .build();
var promises = [];
var promise;
var url = '';

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

			url = fileUrl(file.path);

			promise = new Promise(function(resolve, reject) {
					driver
						.get(url)
						.then(function() {
							var startTimestamp = new Date().getTime();
							new AxeBuilder(driver)
								.analyze(function(results) {
									results.url = url;
									results.timestamp = new Date().getTime();
									results.time = results.timestamp - startTimestamp;
									resolve(results);
								});
						});
			});

			promises.push(promise);

			Promise.all(promises).then(function(results) {
    		fs.writeFileSync(dest, JSON.stringify(results, null, '  '));
				driver.quit().then(function() {
					cb(result);
				});
			});

			/*driver
				.get(fileUrl(file.path))
				.then(function () {
					AxeBuilder(driver)
						.analyze(function (results) {
							console.log(results);
						});
				});*/

		} catch (err) {
			this.emit('error', new gutil.PluginError(PLUGIN_NAME, err));
		}
	});
};
