const fs = require('fs');

const electronTestOutput = JSON.parse(fs.readFileSync('electron.json'));
const openfinTestOutput = JSON.parse(fs.readFileSync('openfin.json'));

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


const tags = [];

electronTestOutput.forEach((test) => {
  test.tags.forEach((tag) => {
    if (!testTable.electron[tag]) {
      testTable.electron[tag] = {
        passed: 0,
        total: 0
      };
    }

    if (test.status === 'pass') {
      testTable.electron[tag].passed++;
      testTable.electron[tag].total++;
    } else if (test.status !== 'pending') {
      testTable.electron[tag].total++;
    }

    if (tags.indexOf(tag) < 0) {
      tags.push(tag);
    }
  });
});

openfinTestOutput.forEach((test) => {
  test.tags.forEach((tag) => {
    if (!testTable.openfin[tag]) {
      testTable.openfin[tag] = {
        passed: 0,
        total: 0
      };
    }

    if (test.status === 'pass') {
      testTable.openfin[tag].passed++;
      testTable.openfin[tag].total++;
    } else if (test.status !== 'pending') {
      testTable.openfin[tag].total++;
    }

    if (tags.indexOf(tag) < 0) {
      tags.push(tag);
    }
  });
});

const sortedTags = tags.sort();

let markdownString = '| Method | Electron | OpenFin |\n|:---|:---:|:---:|\n';

sortedTags.forEach((tag) => {
  const electronPassed = testTable.electron[tag].passed;
  const openfinPassed = testTable.openfin[tag].passed;
  const electronTotal = testTable.electron[tag].total;
  const openfinTotal = testTable.openfin[tag].total;
  const electronColor = electronTotal > 0 ? getColorCode((electronPassed / electronTotal) * 100) : '';
  const openfinColor = openfinTotal > 0 ? getColorCode((openfinPassed / openfinTotal) * 100) : '';
  const label = tag.substring(1); // Removes the # from the front of the tag
  markdownString += `|${label}|<div style="background-color:${electronColor}">${electronPassed}/${electronTotal}</div>|<div style="background-color:${openfinColor}">${openfinPassed}/${openfinTotal}</div>|\n`;
});

fs.writeFileSync('table.md', markdownString);
