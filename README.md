# gulp-axe-core

[![Package Quality](http://npm.packagequality.com/badge/gulp-axe-core.png)](http://npm.packagequality.com/badge/gulp-axe-core.png)

> Gulp plugin to use [axe-core](https://github.com/dequelabs/axe-core)

Inspired by [grunt-axe-webdriver](https://github.com/dequelabs/grunt-axe-webdriver).

## Install

```
$ npm install --save-dev gulp-axe-core
```

## The task

### Usage

#### With Chrome (default)

```js
var gulp = require('gulp');
var axeCore = require('gulp-axe-core');

gulp.task('axe', function() {
  var options = {
			saveOutputIn: 'allHtml.json'
	};
	return gulp.src('src/file2.html')
		.pipe(axeCore(options));
});

```

#### With PhantomJS

```js
var gulp = require('gulp');
var axeCore = require('gulp-axe-core');

gulp.task('axe', function() {
  var options = {
			saveOutputIn: 'allHtml.json',
			browser: 'phantomjs'
	};
	return gulp.src('src/file2.html')
		.pipe(axeCore(options));
});

```

### Options
Type: `Object`
Default value:
```
{
  browser: 'phantomjs',
  threshold: 0,
	folderOutputReport: 'aXeReports',
	saveOutputIn: ''
}
```

#### threshold
Type: `Number`
Default value: `0`

A number that represents the maximum number of allowable violations. Each violation represents a rule that fails, it may fail for an number of nodes. It is recommended that this value not be changed.
A negative value will prevent failure whatever the number of violations.

#### browser
Type: `String`
Default value: `chrome`

Which browser to run the tests in.

### saveOutputIn
Type: `String`
Default value: ''

An optional file to which the results of the accessibility scans will be written as a JSON Array of results objects.

### folderOutputReport
Type: `String`
Default value: 'aXeReports'

An optional folder to indicate where the output will be saved.

## Release History

Read the [full changelog](CHANGELOG.md).

## License

MIT © [Felix Zapata](http://github.com/felixzapata)
