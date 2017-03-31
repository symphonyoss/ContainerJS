var fs = require('fs');
var path = require('path');
var marked = require('marked');

var files = fs.readdirSync(path.join(__dirname, 'src'));

files.forEach((file) => {
  if (path.extname(file) === '.md') {
    // Convert markdown to html
    const md = fs.readFileSync(path.join('src', file), {encoding: 'utf8'});
    const html = marked.parse(md);

    // Append the html to the api demo file
    fs.appendFileSync(path.join('src', file.substr(0, file.length - 3) + '.html'), html);
  }
});
