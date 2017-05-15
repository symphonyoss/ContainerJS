var mocha = require('mocha');
var fs = require('fs');
var path = require('path');

module.exports = JsonReporter;
const testContainer = process.env.MOCHA_CONTAINER;

let jsonOutput = [];
const testTagPattern = /(#[\w.()]+[\s]?)+/;

function JsonReporter(runner) {
  mocha.reporters.Base.call(this, runner);
  var passes = 0;
  var pending = 0;
  var failures = 0;

  runner.on('suite', function(suite) {
    console.log(suite.title);
  });

  runner.on('pass', function(test) {
    passes++;
    const tags = test.title.match(testTagPattern);
    jsonOutput.push({
      title: test.fullTitle(),
      status: 'pass',
      container: testContainer,
      tags: tags === null ? [] : tags[0].split(' ')
    });
    console.log('%s %s', mocha.reporters.Base.symbols.ok, test.title);
  });

  // Runs when a test has been skipped
  runner.on('pending', function(test) {
    pending++;
    const tags = test.title.match(testTagPattern);
    jsonOutput.push({
      title: test.fullTitle(),
      status: 'pending',
      container: testContainer,
      tags: tags === null ? [] : tags[0].split(' ')
    });
    console.log('%s %s', '-', test.title);
  });

  runner.on('fail', function(test, err) {
    failures++;
    const tags = test.title.match(testTagPattern);
    jsonOutput.push({
      title: test.fullTitle(),
      status: 'fail',
      container: testContainer,
      tags: tags === null ? [] : tags[0].split(' ')
    });
    console.log('%s %s -- error: %s', mocha.reporters.Base.symbols.err, test.title, err.message);
  });

  runner.on('end', function() {
    console.log('pass:%d pending:%d failure:%d', passes, pending, failures);
    if (!fs.existsSync(path.join(process.cwd(), 'coverage'))) {
      fs.mkdirSync(path.join(process.cwd(), 'coverage'));
    }
    fs.writeFileSync(path.join(process.cwd(), 'coverage', testContainer + '.json'), JSON.stringify(jsonOutput));
    process.exit(failures > 0 ? 1 : 0);
  });
}
