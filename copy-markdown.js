const fs = require('fs');
const path = require('path');
const marked = require('marked');

const directories = fs.readdirSync(path.join(__dirname, 'packages')).filter(d => d.includes('demo'));
directories.forEach((dir) => {
  const srcDir = path.join(__dirname, 'packages', dir, 'src');
  const files = fs.readdirSync(srcDir);

  files.forEach((file) => {
    if (path.extname(file) === '.md') {
      // Convert markdown to html
      const md = fs.readFileSync(path.join(srcDir, file), {encoding: 'utf8'});
      // Need to strip out the file data used for gh-pages
      const strippedMd = md.split('---')[2];
      const html = marked.parse(strippedMd);

      // Append the html to the api demo file
      fs.appendFileSync(path.join(srcDir, file.substr(0, file.length - 3) + '.html'), html);
    }
  });
});
