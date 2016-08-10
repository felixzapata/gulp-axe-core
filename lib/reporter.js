'use strict';

var gutil = require('gulp-util');

function color(code, str) {
	return '\u001b[' + code + 'm' + str + '\u001b[0m';
}

module.exports = function(results, threshold) {
	var pass = true;
  results.forEach(function(result) {
  gutil.log(gutil.colors.cyan('File to test: ' + result.url));
  var violations = result.violations;
  if (violations.length) {
    if (threshold < 0) {
      gutil.log(gutil.colors.green('Found ' + violations.length + ' accessibility violations: (no threshold)'));
    } else if (violations.length > threshold) {
      pass = false;
      gutil.log(gutil.colors.red('Found ' + violations.length + ' accessibility violations:'));
    } else {
      gutil.log(gutil.colors.green('Found ' + violations.length + ' accessibility violations: (under threshold of ' + threshold + ')'));
    }
    violations.forEach(function(ruleResult) {
      gutil.log(' ' + color(31, '\u00D7') + ' ' + ruleResult.help);

      ruleResult.nodes.forEach(function(violation, index) {
        gutil.log('   ' + (index + 1) + '. ' + JSON.stringify(violation.target));

        if (violation.any.length) {
          gutil.log('       Fix any of the following:');
          violation.any.forEach(function(check) {
            gutil.log('        \u2022 ' + check.message);
          });
        }

        var alls = violation.all.concat(violation.none);
        if (alls.length) {
          gutil.log('       Fix all of the following:');
          alls.forEach(function(check) {
            gutil.log('        \u2022 ' + check.message);
          });
        }
        gutil.log('\n');
      });
    });
  } else {
    gutil.log(gutil.colors.green('Found no accessibility violations.'));
  }
  });
	return pass;
};