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
require('chromedriver');

//setup custom phantomJS capability
var phantomjs_exe = require('phantomjs-prebuilt').path;
var customPhantom = WebDriver.Capabilities.phantomjs().set('phantomjs.binary.path', phantomjs_exe);

var promise;
var results = [];

module.exports = function (customOptions) {

	var defaultOptions = {
		browser: 'chrome',
		folderOutputReport: 'aXeReports',
		saveOutputIn: '',
		threshold: 0
	};

	var options = customOptions ? Object.assign(defaultOptions, customOptions) : defaultOptions;
	var driver = options.browser === 'phantomjs' ? new WebDriver.Builder().withCapabilities(customPhantom).build() : new WebDriver.Builder().forBrowser(options.browser).build();

	var createResults = function(cb) {

		var dest = '';
		if(options.saveOutputIn !== '') {
			dest = path.join(options.folderOutputReport, options.saveOutputIn);
			fs.writeFileSync(dest, JSON.stringify(results, null, '  '));
		}
		driver.quit();
		cb();

	};

	var bufferContents = function (file, enc, cb) {

		if (file.isNull()) {
			cb(null, file);
			return;
		}

		if (file.isStream()) {
			driver.quit();
			cb(new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
			return;
		}

		try {

			promise = new Promise(function(resolve, reject) {
					driver.get(fileUrl(file.path)).then(function() {
						var startTimestamp = new Date().getTime();
						new AxeBuilder(driver)
							.analyze(function(result) {
								result.url = file.path;
								result.timestamp = new Date().getTime();
								result.time = result.timestamp - startTimestamp;
								resolve(result);
							});
					});
			});

			promise.then(function(result) {
				results.push(result);
				reporter(result, options.threshold);
				cb();
			});

		} catch (err) {
			this.emit('error', new gutil.PluginError(PLUGIN_NAME, err));
		}

	};
	return through.obj(bufferContents, createResults);
};
