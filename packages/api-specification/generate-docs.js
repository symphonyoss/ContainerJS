const fs = require('fs');

const output = JSON.parse(fs.readFileSync('type-info.json'));
const testMatrixJson = fs.existsSync('test-report.json')
  ? JSON.parse(fs.readFileSync('test-report.json'))
  : '';

let mdObject = {};

// Read as 10% or less, 25% or less etc
// Colors are the colors for the badges on http://shields.io
const badgeColors = {
  10: 'red',
  25: 'yellow',
  50: 'yellowgreen',
  75: 'green',
  100: 'brightgreen'
};

const getBadgeColor = (percent) => {
  return badgeColors[Object.keys(badgeColors).find((col) => percent <= col)];
};

// === Markdown Generation Methods ===
const generateModule = (moduleObj) => {
  if (moduleObj.children) {
    moduleObj.children.forEach((child) => {
      render(child);
    });
  }
};

const generateClass = (classObj) => {
  mdObject[classObj.name] = `# ${classObj.name}  \n`;
  if (classObj.children) {
    classObj.children.forEach((child) => {
      render(child, classObj.name);
    });
  }
};

const generateMethod = (methodObj, className) => {
  const methodData = methodObj.flags.isStatic ? ' (static)' : '';

  let badgeString = `![${methodObj.name}](https://img.shields.io/badge/Electron-no_test_data-lightgrey.svg) ![${methodObj.name}](https://img.shields.io/badge/OpenFin-no_test_data-lightgrey.svg)`;
  if (testMatrixJson && testMatrixJson[`ssf.${className}.${methodObj.name}`]) {
    const testResults = testMatrixJson[`ssf.${className}.${methodObj.name}`];
    const electronBadgeColor = testResults.electron.total > 0 ? getBadgeColor((testResults.electron.passed / testResults.electron.total) * 100) : 'lightgrey';
    const openfinBadgeColor = testResults.openfin.total > 0 ? getBadgeColor((testResults.openfin.passed / testResults.openfin.total) * 100) : 'lightgrey';
    badgeString = `![${methodObj.name}](https://img.shields.io/badge/Electron-${testResults.electron.passed}%2F${testResults.electron.total}-${electronBadgeColor}.svg) ![${methodObj.name}](https://img.shields.io/badge/OpenFin-${testResults.openfin.passed}%2F${testResults.openfin.total}-${openfinBadgeColor}.svg)`;
  }

  mdObject[className] += `#### ${methodObj.name}${methodData}  ${badgeString}\n`;
  if (methodObj.signatures) {
    methodObj.signatures.forEach((sig) => {
      generateCallSignature(sig, className);
    });
  }
};

const generateInterface = (interfaceObj) => {
  mdObject['I' + interfaceObj.name] = `# ${interfaceObj.name} (Interface)  \n`;
  if (interfaceObj.children) {
    interfaceObj.children.forEach((child) => {
      render(child, 'I' + interfaceObj.name);
    });
  }
};

const generateProperty = (prop, className) => {
  const typeArgsString = getType(prop.type);
  mdObject[className] += `**${prop.name}${prop.flags.isOptional ? '?' : ''}**: \`${typeArgsString}\`  \n`;
  const comment = prop.comment;
  if (comment) {
    if (comment.shortText) {
      mdObject[className] += `${comment.shortText}  \n`;
    }
  }
};

const generateCallSignature = (sig, className) => {
  const returnTypeString = getType(sig.type);
  const paramString = getParamList(sig.parameters).join(', ');
  mdObject[className] += `\`${sig.name}(${paramString}) => ${returnTypeString}\`  \n`;
  const comment = sig.comment;
  if (comment) {
    if (comment.shortText) {
      mdObject[className] += `${comment.shortText}  \n`;
    }
    if (comment.returns) {
      mdObject[className] += `**Returns:** \`${returnTypeString}\` - ${comment.returns}  \n`;
    }
  }
};

const generateConstructor = (constructorObj, className) => {
  let badgeString = `![${constructorObj.name}](https://img.shields.io/badge/Electron-no_test_data-lightgrey.svg) ![${constructorObj.name}](https://img.shields.io/badge/OpenFin-no_test_data-lightgrey.svg)`;
  if (testMatrixJson && testMatrixJson[`ssf.${className}()`]) {
    const testResults = testMatrixJson[`ssf.${className}()`];
    const electronBadgeColor = testResults.electron.total > 0 ? getBadgeColor((testResults.electron.passed / testResults.electron.total) * 100) : 'lightgrey';
    const openfinBadgeColor = testResults.openfin.total > 0 ? getBadgeColor((testResults.openfin.passed / testResults.openfin.total) * 100) : 'lightgrey';
    badgeString = `![${constructorObj.name}](https://img.shields.io/badge/Electron-${testResults.electron.passed}%2F${testResults.electron.total}-${electronBadgeColor}.svg) ![${constructorObj.name}](https://img.shields.io/badge/OpenFin-${testResults.openfin.passed}%2F${testResults.openfin.total}-${openfinBadgeColor}.svg)`;
  }

  mdObject[className] += `#### ${constructorObj.name}  ${badgeString}\n`;
  if (constructorObj.signatures) {
    constructorObj.signatures.forEach((sig) => {
      generateCallSignature(sig, className);
    });
  }
};

// === Types ===
const getReflectionType = (type) => {
  let reflectionType = '';
  if (type.declaration.kindString === 'Type literal') {
    const signatures = type.declaration.signatures;
    signatures.forEach((signature, index) => {
      if (signature.kindString === 'Call signature') {
        reflectionType += `(${getParamList(signature.parameters).join(', ')}) => ${getType(signature.type)}`;
      }
    });
  }
  return reflectionType;
};

const getArgsType = (typeArgs) => {
  return '<' + typeArgs.map((arg) => getType(arg)).join(', ') + '>';
};

const getUnionType = (type) => {
  return type.types.map((t) => getType(t)).join('|');
};

const getType = (type) => {
  if (!type) {
    return '';
  }

  if (type.type === 'union') {
    return getUnionType(type);
  } else if (type.type === 'reflection') {
    return getReflectionType(type);
  } else if (type.typeArguments) {
    return type.name + getArgsType(type.typeArguments);
  } else {
    return type.name;
  }
};

const getParamList = (paramList) => {
  let params = [];
  if (!paramList) {
    return params;
  }

  paramList.forEach((arg) => {
    params.push(arg.name + ': ' + getType(arg.type));
  });
  return params;
};

const render = (doc, className) => {
  switch (doc.kindString) {
    case 'Module':
      generateModule(doc);
      break;
    case 'Class':
      generateClass(doc);
      break;
    case 'Method':
      generateMethod(doc, className);
      break;
    case 'Interface':
      generateInterface(doc, className);
      break;
    case 'Property':
      generateProperty(doc, className);
      break;
    case 'Constructor':
      generateConstructor(doc, className);
      break;
  };
};

output.children.forEach((child) => {
  render(child);
});

const generatePagesHeader = (api) => {
  const id = `id: ${api}Api\n`;
  const title = `title: ${api} Api\n`;
  const link = `permalink: docs/${api}.html\n`;
  const layout = `layout: docs\n`;
  const section = `sectionid: docs\n`;
  return `---  \n${id}${title}${link}${layout}${section}---  \n\n`;
};

if (!fs.existsSync('docs')) {
  fs.mkdirSync('docs');
}
Object.keys(mdObject).forEach((key) => {
  fs.writeFileSync('docs/' + key + '.md', generatePagesHeader(key) + mdObject[key]);
});

const generateLinks = () => {
  const links = [];
  Object.keys(mdObject).forEach((key) => {
    links.push(`<a {% if page.id == '${key}Api' %} class="list-group-item active" {% else %} class="list-group-item" {% endif %} href="/ContainerJS/docs/${key}">${key} API</a>`);
  });
  return links.join('\n');
};

const generateDocsTemplate = () => {
  const metadata = '---\nlayout: default\nsectionid: docs\n---\n\n';
  const preListTemplate = '<section class="content row mr-0 ml-0">\n<div class="list-group col-3">\n';
  const testMatrix = `<a {% if page.id == 'testMatrix' %} class="list-group-item active" {% else %} class="list-group-item" {% endif %} href="/ContainerJS/docs/test-matrix">Test Matrix</a>\n`;
  const postListTemplate = '</div>\n<div class="doc-body pl-2 pt-2 col-9">\n{{ content }}\n</div>\n</section>';
  return `${metadata}${preListTemplate}${generateLinks()}${testMatrix}${postListTemplate}`;
};

fs.writeFileSync('docs/docs.html', generateDocsTemplate());
