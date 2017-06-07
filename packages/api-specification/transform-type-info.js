const jsont = require('json-transforms');
const fs = require('fs');
const jspath = require('jspath');
const program = require('commander');
const json2html = require('html2json').json2html;
const matter = require('gray-matter');
const path = require('path');

program
  .option('-i, --infile [filename]', 'Input type definitions file', 'type-info.json')
  .option('-t, --testfile [filename]', 'Input test report file')
  .option('-o, --outpath [folder]', 'Folder to place generated docs', '.')
  .parse(process.argv);

const outpath = path.resolve(process.cwd(), program.outpath);
console.log(outpath);

const flatten = (arr) => arr.reduce((a, b) => a.concat(b), []);

// html elements are a bit complex, this simplifies their construction
const element = (tag, child) => ({
  node: 'element',
  tag,
  // if child is not an array, turn it into one - also, filter out any undefined children
  child: (Array.isArray(child) ? child : [child]).filter(d => d)
});

// text elements have not children
const text = (text) => ({
  node: 'text',
  text
});

// there are a number of elements that just host a single text node, this
// simplifies their construction
const textElement = (tag) => (body) => element(tag, text(body));
const h4 = textElement('h4');
const h1 = textElement('h1');
const h3 = textElement('h3');
const h2 = textElement('h2');
const p = textElement('p');
const dt = textElement('dt');
const dd = textElement('dd');

// there are a number of elements that host multiple children, this
// simplifies their construction
const parentElement = (tag) => (children) => element(tag, children);
const section = parentElement('section');
const dl = parentElement('dl');

const typeInfo = JSON.parse(fs.readFileSync(program.infile));

// add the test report information to the type information
if (program.testfile) {
  if (fs.existsSync(program.testfile)) {
    const testReport = JSON.parse(fs.readFileSync(program.testfile));
    Object.keys(testReport).forEach((testMethod) => {
      const results = testReport[testMethod];
      const [, className, methodName] = testMethod.split('.');
      const method = jspath.apply(`..{.kindString === "Class" && .name === "${className}"}.children{.kindString === "Method" && .name === "${methodName}"}`, typeInfo);
      if (method.length > 0) {
        method[0].results = results;
      } else {
        console.warn(`unable to find the method ${testMethod} within the typescript documentation`);
      }
    });
  } else {
    console.warn('Could not find test report, generating documentation without test data');
  }
}

const formatType = (type) => {
  switch (type.type) {
    case 'intrinsic':
    case 'reference':
      return type.name +
        (type.typeArguments !== undefined ? '&lt;' + type.typeArguments.map(formatType).join(', ') + '&gt;' : '');
    case 'union':
      return type.types.map(formatType).join(' | ');
  }
  return 'UNKNOWN';
};

const documentClass = (className) => {
  const rules = [
    // perform a 'deep' match to find any class declarations, then recursively
    // matches from this point onwards
    jsont.pathRule(
      `..children{.kindString === "Class" && .name === "${className}"}`, d => ({
        node: 'root',
        child: [d.runner()]
      })
    ),
    jsont.pathRule(
      '.{.kindString === "Class"}', d =>
        section([
          h1(d.match.name),
          // create the various sections by filtering the children based on their 'kind'
          h2('Constructors'),
          section(d.runner(jspath.apply('.{.kindString === "Constructor"}', d.match.children))),
          h2('Properties'),
          section(d.runner(jspath.apply('.{.kindString === "Property"}', d.match.children))),
          h2('Methods'),
          section(d.runner(jspath.apply('.{.kindString === "Method"}', d.match.children)))
        ])
    ),
    jsont.pathRule(
      '.{.kindString === "Method" || .kindString === "Constructor"}', d =>
        // we take just the first signature as the definition of the method, not
        // sure when there might be multiple signatures?!
        section([
          d.runner(d.match.signatures[0]),
          h4('test results'),
          p(JSON.stringify(d.match.results))
        ])
    ),
    jsont.pathRule(
      '.{.kindString === "Property"}', d =>
        section([
          h4(d.match.name),
          p(d.match.comment ? d.match.comment.shortText : '')
        ])
    ),
    jsont.pathRule(
      '.{.kindString === "Call signature" || .kindString === "Constructor signature"}', d =>
        section([
          h3(d.match.name),
          p(d.match.comment ? d.match.comment.shortText : ''),
          h4('Returns'),
          p(formatType(d.match.type)),
          d.match.parameters ? h4('Arguments') : undefined,
          // NOTE: we flatten because each parameter returns an array of dt / dd, we want to
          // flatten from [[dt, dd], [dt, dd]] to [dt, dd, dt, dd]
          d.match.parameters ? dl(flatten(d.runner(d.match.parameters))) : undefined
        ])
    ),
    jsont.pathRule(
      '.{.kindString === "Parameter"}', d => [
        dt(`${d.match.name} [${formatType(d.match.type)}]`),
        dd(d.match.comment ? d.match.comment.text : '')
      ]
    )
  ];

  const json = jsont.transform(typeInfo, rules);
  const html = json2html(json);
  const yml = matter.stringify(html, {
    layout: 'api',
    sectionid: 'docs',
    class: className
  });

  if (!fs.existsSync(outpath)) {
    fs.mkdirSync(outpath);
  }
  fs.writeFileSync(`${outpath}/${className}.html`, yml);
};

// find the list of classes - these are generated as separate documentation pages
const classes = jsont.transform(typeInfo, [
  jsont.pathRule('..children{.kindString === "Class"}', d => d.runner()),
  jsont.pathRule('.{.kindString === "Class"}', d => d.match.name)
]);

classes.forEach(documentClass);
