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
  .option('-n, --navigation [folder]', 'Folder to place navigation json file', '.')
  .parse(process.argv);

const outpath = path.resolve(process.cwd(), program.outpath);
console.log(outpath);

const outpathData = path.resolve(process.cwd(), program.navigation);
console.log(outpathData);

const flatten = (arr) => arr.reduce((a, b) => a.concat(b), []);

// html elements are a bit complex, this simplifies their construction
const element = (tag, child, attr) => ({
  node: 'element',
  attr,
  tag,
  // if child is not an array, turn it into one - also, filter out any undefined children
  child: (Array.isArray(child) ? child : [child]).filter(d => d)
});

// text elements have not children
const text = (text) => ({
  node: 'text',
  text
});

const colorBoundaries = [0, 10, 25, 50, 75, 100];

const testResultPercentage = (passed, total) => total > 0 ? `test-color-${colorBoundaries.filter((c) => c <= Math.round((passed / total) * 100)).slice(-1).pop()}` : '';

// there are a number of elements that just host a single text node, this
// simplifies their construction
const textElement = (tag) => (body, attr) => element(tag, text(body), attr);
const h5 = textElement('h5');
const h4 = textElement('h4');
const h3 = textElement('h3');
const h2 = textElement('h2');
const p = textElement('p');
const dt = textElement('dt');
const dd = textElement('dd');

// there are a number of elements that host multiple children, this
// simplifies their construction
const parentElement = (tag) => (children, attr) => element(tag, children, attr);
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
        method[0].signatures[0].results = results;
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
          h2(d.match.name),
          // create the various sections by filtering the children based on their 'kind'
          jspath.apply('.{.kindString === "Constructor"}', d.match.children).length !== 0 ? h3('Constructors') : undefined,
          jspath.apply('.{.kindString === "Constructor"}', d.match.children).length !== 0 ? section(d.runner(jspath.apply('.{.kindString === "Constructor"}', d.match.children)), {class: 'constructors'}) : undefined,
          jspath.apply('.{.kindString === "Property"}', d.match.children).length !== 0 ? h3('Properties') : undefined,
          jspath.apply('.{.kindString === "Property"}', d.match.children).length !== 0 ? section(d.runner(jspath.apply('.{.kindString === "Property"}', d.match.children)), {class: 'properties'}) : undefined,
          jspath.apply('.{.kindString === "Method"}', d.match.children).length !== 0 ? h3('Methods') : undefined,
          jspath.apply('.{.kindString === "Method"}', d.match.children).length !== 0 ? section(d.runner(jspath.apply('.{.kindString === "Method"}', d.match.children)), {class: 'methods'}) : undefined
        ], {id: className, class: 'jumptarget'})
    ),
    jsont.pathRule(
      '.{.kindString === "Method" || .kindString === "Constructor"}', d =>
        // we take just the first signature as the definition of the method, not
        // sure when there might be multiple signatures?!
        section([
          d.runner(d.match.signatures[0])
        ], {class: 'method'})
    ),
    jsont.pathRule(
      '.{.kindString === "Property"}', d =>
        section([
          h5(d.match.name, {class: 'code'}),
          p(d.match.comment ? d.match.comment.shortText : '')
        ], {class: 'property', id: d.match.name})
    ),
    jsont.pathRule(
      '.{.kindString === "Call signature" || .kindString === "Constructor signature"}', d =>
        section([
          h4(d.match.name, {class: 'method-name', id: `${className}-${d.match.name}`}),
          d.match.results ? section([
            p('Electron'),
            p(`${d.match.results.electron.passed}/${d.match.results.electron.total}`, {class: 'test-result ' + testResultPercentage(d.match.results.electron.passed, d.match.results.electron.total)}),
            p('OpenFin'),
            p(`${d.match.results.openfin.passed}/${d.match.results.openfin.total}`, {class: 'test-result ' + testResultPercentage(d.match.results.openfin.passed, d.match.results.openfin.total)}),
            p('Browser'),
            p(`${d.match.results.browser.passed}/${d.match.results.browser.total}`, {class: 'test-result ' + testResultPercentage(d.match.results.browser.passed, d.match.results.browser.total)})
          ], {class: 'test-results'}) : undefined,
          p(d.match.comment ? d.match.comment.shortText : ''),
          d.match.parameters ? h5('Arguments') : undefined,
          // NOTE: we flatten because each parameter returns an array of dt / dd, we want to
          // flatten from [[dt, dd], [dt, dd]] to [dt, dd, dt, dd]
          d.match.parameters ? dl(flatten(d.runner(d.match.parameters))) : undefined,
          p('Returns:', {class: 'return-text'}),
          p(formatType(d.match.type), {class: 'code return-type'})
        ])
    ),
    jsont.pathRule(
      '.{.kindString === "Parameter"}', d => [
        dt(`${d.match.name} [${formatType(d.match.type)}]`, {class: 'code argument'}),
        dd(d.match.comment ? d.match.comment.text : '')
      ]
    )
  ];

  const json = jsont.transform(typeInfo, rules);
  const html = json2html(json);

  if (!fs.existsSync(outpath)) {
    fs.mkdirSync(outpath);
  }
  fs.appendFileSync(`${outpath}/docs.html`, html);
};

// find the list of classes
const classes = jsont.transform(typeInfo, [
  jsont.pathRule('..children{.kindString === "Class"}', d => d.runner()),
  jsont.pathRule('.{.kindString === "Class"}', d => d.match.name)
]);

const yml = matter.stringify('', {
  layout: 'api',
  sectionid: 'docs',
  class: 'docs'
});

fs.writeFileSync(`${outpath}/Docs.html`, yml);
fs.writeFileSync(`${outpathData}/navigation.json`, JSON.stringify(classes));

classes.forEach(documentClass);
