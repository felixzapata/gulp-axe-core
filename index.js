'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var fileUrl = require('file-url');
var path = require('path');
var fs = require('fs-path');
var AxeBuilder = require('axe-webdriverjs');
var WebDriver = require('selenium-webdriver');
var Promise = require('promise');
var reporter = require('./lib/reporter');
var PLUGIN_NAME = 'gulp-axe-core';

var promise;
var promises = [];
var result;

module.exports = function (customOptions) {

	var createResults = function(cb) {
		Promise.all(promises).then(function(results) {
			var dest = '';
			if(options.saveOutputIn !== '') {
				dest = path.join(options.folderOutputReport, options.saveOutputIn);
				fs.writeFileSync(dest, JSON.stringify(results, null, '  '));
			}
			result = reporter(results, options.threshold);
			driver.quit().then(function() {
				cb(result);
			});
		});
	};

	var defaultOptions = {
		browser: 'firefox',
		server: null,
		folderOutputReport: 'aXeReports',
		saveOutputIn: '',
		threshold: 0
	};

	var options = customOptions ? Object.assign(defaultOptions, customOptions) : defaultOptions;
	var driver = new WebDriver.Builder().forBrowser(options.browser).build();

	var bufferContents = function (file, enc, cb) {
		
		if (file.isNull()) {
			cb(null, file);
			return;
		}
		if (file.isStream()) {
			cb(new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
			return;
		}

		try {

			promise = new Promise(function(resolve, reject) {
					driver.get(fileUrl(file.path)).then(function() {
						var startTimestamp = new Date().getTime();
						new AxeBuilder(driver)
							.analyze(function(results) {
								results.url = file.path;
								results.timestamp = new Date().getTime();
								results.time = results.timestamp - startTimestamp;
								resolve(results);
							});
					});
			});

			promises.push(promise);

		} catch (err) {
			this.emit('error', new gutil.PluginError(PLUGIN_NAME, err));
		}

		cb();

	};
	return through.obj(bufferContents, createResults);
};
