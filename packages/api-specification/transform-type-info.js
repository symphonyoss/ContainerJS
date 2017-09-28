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
  .option('-o, --outfile [filename]', 'Output file for generated documentation', '.')
  .parse(process.argv);

const outfile = path.resolve(process.cwd(), program.outfile);

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

const testResultPercentage = (passed, total) =>
  total > 0 ? `test-color-${colorBoundaries.filter((c) => c <= Math.round((passed / total) * 100)).slice(-1).pop()}` : '';

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
const span = textElement('span');

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
      const getSelectionString = (type, name, childName) => `..{(.kindString === "Class" || .kindString === "Interface") && .name === "${name}"}.children{.kindString === "${type}"` + (childName ? `&& .name === "${childName}"}` : '}');
      const getPassed = obj => obj ? obj.passed : 0;
      const getTotal = obj => obj ? obj.total : 0;

      const results = testReport[testMethod];
      results.combined = {
        passed: getPassed(results.electron) + getPassed(results.openfin) + getPassed(results.browser),
        total: getTotal(results.electron) + getTotal(results.openfin) + getTotal(results.browser)
      };

      const [, parentName, childName] = testMethod.split('.');
      const method = jspath.apply(getSelectionString('Method', parentName, childName), typeInfo);
      if (method.length > 0) {
        method[0].signatures[0].results = results;
        return;
      }
      const property = jspath.apply(getSelectionString('Property', parentName, childName), typeInfo);
      if (property.length > 0) {
        property[0].results = results;
        return;
      }

      const constructor = jspath.apply(getSelectionString('Constructor', parentName), typeInfo);
      // Got a constructor
      if (!childName && constructor.length) {
        constructor[0].results = results;
        return;
      }

      console.warn(`unable to find ${testMethod} within the typescript documentation`);
    });
  } else {
    console.warn('Could not find test report, generating documentation without test data');
  }
}

let documentedTypes = [];

const formatType = (type) => {
  switch (type.type) {
    case 'intrinsic':
    case 'reference':
      const typeName = type.name +
        (type.typeArguments !== undefined ? '&lt;' + type.typeArguments.map(formatType).join(', ') + '&gt;' : '');

      const docType = documentedTypes.find(t => t.name === type.name);
      return docType
          ? `<a href="#${docType.name}${docType.isClass ? '' : '-interface'}">${typeName}</a>`
          : typeName;
    case 'union':
      return type.types.map(formatType).join(' | ');
    case 'reflection':
      const parameters = type.declaration.signatures[0].parameters || [];
      return '(' + parameters.map((param) => param.name + ': ' + formatType(param.type)).join(',') + ') => ' + formatType(type.declaration.signatures[0].type);
  }
  return 'UNKNOWN';
};

const breakText = (text) => text ? text.split(/\n\n/) : [];
const formatComment = (comment) =>
  comment && [...breakText(comment.shortText), ...breakText(comment.text)]
            .filter(d => d.trim().length > 0).join('<br/>');

const testResults = (title, results) => results ? [
  h5(title, {class: 'test-result-title'}),
  span(`${results.passed}/${results.total}`, {class: 'test-result ' + testResultPercentage(results.passed, results.total)})
] : [];

const testPip = (results) => results ? [
  span('', {class: 'test-pip test-result ' + testResultPercentage(results.passed, results.total)})
] : [];

const testCombinedResults = results => section([
  ...testResults('Tests', results.combined),
  ...testPip(results.electron),
  ...testPip(results.openfin),
  ...testPip(results.browser),
  section([
    section([
      ...testResults('Electron', results.electron),
      ...testResults('OpenFin', results.openfin),
      ...testResults('Browser', results.browser)
    ], { class: 'test-content' })
  ], { class: 'test-collapsible' })
], {class: 'test-results'});

const documentClass = (className, isClass) => {
  const createElement = (d, singular, plural) => [
    jspath.apply(`.{.kindString === "${singular}"}`, d.match.children).length && h3(plural),
    jspath.apply(`.{.kindString === "${singular}"}`, d.match.children).length && section(d.runner(jspath.apply(`.{.kindString === "${singular}"}`, d.match.children)), {class: plural.toLowerCase()})
  ];

  const createConstructor = (d) => createElement(d, 'Constructor', 'Constructors');
  const createProperties = (d) => createElement(d, 'Property', 'Properties');
  const createMethods = (d) => createElement(d, 'Method', 'Methods');

  const rules = [
    // perform a 'deep' match to find any class declarations, then recursively
    // matches from this point onwards
    jsont.pathRule(
      `..children{.kindString === "${isClass ? 'Class' : 'Interface'}" && .name === "${className}"}`, d => ({
        node: 'root',
        child: [d.runner()]
      })
    ),
    jsont.pathRule(
      '.{.kindString === "Class"}', d =>
        section([
          h2(d.match.name),
          p(formatComment(d.match.comment)),
          // create the various sections by filtering the children based on their 'kind'
          ...createConstructor(d),
          ...createProperties(d),
          ...createMethods(d)], {id: className, class: 'docs-title'})
    ),
    jsont.pathRule(
      '.{.kindString === "Interface"}', d =>
        section([
          h2(d.match.name),
          p(formatComment(d.match.comment)),
          // create the various sections by filtering the children based on their 'kind'
          ...createProperties(d),
          ...createMethods(d)], {id: className + '-interface', class: 'docs-title'})
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
          h4(d.match.name, {class: 'property-name'}),
          d.match.results && testCombinedResults(d.match.results),
          p(formatComment(d.match.comment))
        ], {class: 'property', id: d.match.name})
    ),
    jsont.pathRule(
      '.{.kindString === "Call signature" || .kindString === "Constructor signature"}', d =>
        section([
          h4(d.match.name, {class: 'method-name', id: `${className}-${d.match.name}`}),
          d.match.results && testCombinedResults(d.match.results),
          p(formatComment(d.match.comment)),
          d.match.parameters && h5('Arguments'),
          // NOTE: we flatten because each parameter returns an array of dt / dd, we want to
          // flatten from [[dt, dd], [dt, dd]] to [dt, dd, dt, dd]
          d.match.parameters && dl(flatten(d.runner(d.match.parameters))),
          h5('Returns'),
          dl([
            dt(formatType(d.match.type), {class: 'code return-value'}),
            dd(d.match.comment ? d.match.comment.returns : '')
          ])
        ])
    ),
    jsont.pathRule(
      '.{.kindString === "Parameter"}', d => [
        dt(`${d.match.name} [${formatType(d.match.type)}]`, {class: 'code argument'}),
        dd(formatComment(d.match.comment))
      ]
    )
  ];

  const json = jsont.transform(typeInfo, rules);
  const html = json2html(json);

  fs.appendFileSync(outfile, html);
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

fs.writeFileSync(outfile, yml);
// Need to say if the name is a class or not because of the 'Window' class and 'Window' interface
const mappedClasses = classes.sort().map((name) => ({name, isClass: true}));

// find the list of interfaces
const interfaces = jsont.transform(typeInfo, [
  jsont.pathRule('..children{.kindString === "Interface"}', d => d.runner()),
  jsont.pathRule('.{.kindString === "Interface"}', d => d.match.name)
]);

const mappedInterfaces = interfaces.sort().map((name) => ({name, isClass: false}));
const allSections = mappedClasses.concat(mappedInterfaces);

documentedTypes = mappedClasses.concat(mappedInterfaces);

allSections.forEach((section) => documentClass(section.name, section.isClass));
