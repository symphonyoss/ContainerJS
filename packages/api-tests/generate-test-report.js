const fs = require('fs');
const path = require('path');
const electronTestOutput = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'coverage', 'electron.json')));
const openfinTestOutput = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'coverage', 'openfin.json')));
const browserTestOutput = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'coverage', 'browser.json')));

const testTable = {
  electron: {},
  openfin: {},
  browser: {}
};

// Read as 10% or less, 25% or less etc
const percentageColors = {
  10: '#f45858',
  25: '#f2f23c',
  50: '#aeea3f',
  75: '#85ea4f',
  100: '#50ce5b'
};

const getColorCode = (percent) => {
  let colorCode = '';
  Object.keys(percentageColors).some((key) => {
    if (percent <= parseInt(key)) {
      colorCode = percentageColors[key];
      return true;
    }
    return false;
  });
  return colorCode;
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

browserTestOutput.forEach((test) => {
  test.tags.forEach((tag) => passCount(testTable.browser, tag, test));
});

generateTotals(electronTestOutput);
generateTotals(openfinTestOutput);
generateTotals(browserTestOutput);

const sortedTags = Object.keys(tagCount).sort();

const outputJson = {};

let markdownString = '| Method | Electron | OpenFin | Browser |\n|:---|:---:|:---:|:---:|\n';

const createColumn = (color, passed, total) => {
  return `<span style="background-color:${color}; display: block;">${passed}/${total}</span>`;
};

sortedTags.forEach((tag) => {
  const electronPassed = testTable.electron[tag] || 0;
  const openfinPassed = testTable.openfin[tag] || 0;
  const browserPassed = testTable.browser[tag] || 0;
  const total = tagCount[tag];
  const label = tag.substring(1); // Removes the # from the front of the tag
  const electronColor = total > 0 ? getColorCode((electronPassed / total) * 100) : '';
  const openfinColor = total > 0 ? getColorCode((openfinPassed / total) * 100) : '';
  const browserColor = total > 0 ? getColorCode((browserPassed / total) * 100) : '';
  markdownString += `|${label}|${createColumn(electronColor, electronPassed, total)}|${createColumn(openfinColor, openfinPassed, total)}|${createColumn(browserColor, browserPassed, total)}|\n`;
  outputJson[label] = {
    electron: {
      passed: electronPassed,
      total
    },
    openfin: {
      passed: openfinPassed,
      total
    },
    browser: {
      passed: browserPassed,
      total
    }
  };
});

const ghPagesMarkdown =
`---
id: testMatrix
title: Test Report
permalink: docs/test-matrix.html
layout: docs
sectionid: docs
---\n
{: width="100%"}
`;

const docsPath = path.join(__dirname, '..', '..', 'docs');
if (!fs.existsSync(docsPath)) {
  fs.mkdirSync(docsPath);
}
fs.writeFileSync(path.join(docsPath, 'test-matrix.md'), ghPagesMarkdown + markdownString);

fs.writeFileSync(path.join(__dirname, '..', 'api-specification', 'test-report.json'), JSON.stringify(outputJson));
