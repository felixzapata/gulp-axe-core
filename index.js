'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var fileUrl = require('file-url');
var AxeBuilder = require('axe-webdriverjs');
var WebDriver = require('selenium-webdriver');
var Promise = require('promise');
var reporter = require('./lib/reporter');
var PLUGIN_NAME = 'gulp-axe-core';

var promises = [];
var promise;
var url = '';

module.exports = function (customOptions) {

	var createResults = function(cb) {
		var result;
		Promise.all(promises).then(function(results) {
			if(options.createReportFile) {
				fs.writeFileSync(dest, JSON.stringify(results, null, '  '));
			}
			result = reporter(results, options.threshold);
			driver.quit().then(function() {
				cb(result);
			});
		});
		cb();
	};

	var defaultOptions = {
		browser: 'firefox',
		server: null,
		createReportFile: false,
		threshold: 0
	};

	var options = customOptions ? Object.assign(defaultOptions, customOptions) : defaultOptions;

	var driver = new WebDriver.Builder()
  .forBrowser(options.browser)
  .build();

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

			createResults(cb);

		} catch (err) {
			this.emit('error', new gutil.PluginError(PLUGIN_NAME, err));
		}
	});

	


};
