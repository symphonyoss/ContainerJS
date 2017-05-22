const fs = require('fs');
const path = require('path');
const electronTestOutput = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'coverage', 'electron.json')));
const openfinTestOutput = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'coverage', 'openfin.json')));

const testTable = {
  electron: {},
  openfin: {}
};

const testStatus = {
  pass: 'pass',
  skip: 'pending',
  error: 'error'
};

const listOfTests = [];
const tagCount = {};
// generate the total test count
const generateTotals = (testOutput) => {
  testOutput.forEach((test) => {
    if (!listOfTests.find((t) => t === test.title)) {
      listOfTests.push(test.title);
      test.tags.forEach((tag) => {
        if (test.status !== testStatus.skip) {
          if (tagCount[tag]) {
            tagCount[tag]++;
          } else {
            tagCount[tag] = 1;
          }
        } else if (!tagCount[tag]) {
          tagCount[tag] = 0;
        }
      });
    }
  });
};

const passCount = (table, tag, test) => {
  if (!table[tag]) {
    table[tag] = 0;
  }

  if (test.status === testStatus.pass) {
    table[tag]++;
  }
};

electronTestOutput.forEach((test) => {
  test.tags.forEach((tag) => passCount(testTable.electron, tag, test));
});

openfinTestOutput.forEach((test) => {
  test.tags.forEach((tag) => passCount(testTable.openfin, tag, test));
});

generateTotals(electronTestOutput);
generateTotals(openfinTestOutput);

const sortedTags = Object.keys(tagCount).sort();

const outputJson = {};

sortedTags.forEach((tag) => {
  const electronPassed = testTable.electron[tag];
  const openfinPassed = testTable.openfin[tag];
  const total = tagCount[tag];
  const label = tag.substring(1); // Removes the # from the front of the tag
  outputJson[label] = {
    electron: {
      passed: electronPassed,
      total
    },
    openfin: {
      passed: openfinPassed,
      total
    }
  };
});

fs.writeFileSync(path.join(__dirname, '..', 'api-specification', 'test-report.json'), JSON.stringify(outputJson));
