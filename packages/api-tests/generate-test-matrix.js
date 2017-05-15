const fs = require('fs');
const path = require('path');
const electronTestOutput = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'coverage', 'electron.json')));
const openfinTestOutput = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'coverage', 'openfin.json')));

const testTable = {
  electron: {},
  openfin: {}
};

// Read as 10% or less, 25% or less etc
const percentageColors = {
  10: '#f45858',
  25: '#f2f23c',
  50: '#aeea3f',
  75: '#85ea4f',
  100: '#50ce5b'
};

const testStatus = {
  pass: 'pass',
  skip: 'pending',
  error: 'error'
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

let markdownString = '| Method | Electron | OpenFin |\n|:---|:---:|:---:|\n';

sortedTags.forEach((tag) => {
  const electronPassed = testTable.electron[tag];
  const openfinPassed = testTable.openfin[tag];
  const total = tagCount[tag];
  const electronColor = total > 0 ? getColorCode((electronPassed / total) * 100) : '';
  const openfinColor = total > 0 ? getColorCode((openfinPassed / total) * 100) : '';
  const label = tag.substring(1); // Removes the # from the front of the tag
  markdownString += `|${label}|<span style="background-color:${electronColor}; display: block;">${electronPassed}/${total}</span>|<span style="background-color:${openfinColor}; display: block;">${openfinPassed}/${total}</span>|\n`;
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

fs.writeFileSync(path.join(__dirname, '..', '..', 'docs', 'docs', 'test-matrix.md'), ghPagesMarkdown + markdownString);
