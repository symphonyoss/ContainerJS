const { app } = require('electron');
const ssfElectron = require('./index.js');
const fs = require('fs');
const path = require('path');
const program = require('commander');
const download = require('download');
const packageJson = require('./package.json');

program
  .version(packageJson.version)
  .option('-u, --url [url]', 'Launch url for the application (can be specified in --config instead)', null)
  .option('-c, --config [filename]', '(Optional) ContainerJS config file', null)
  .option('-s, --symphony', '(Optional) Use Symphony compatibility layer', (v, val) => true, false)
  .option('-d, --developer', '(Optional) Show developer menu', (v, val) => true, false)
  .parse(process.argv.filter(a => a !== '--enable-sandbox'));

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow() {
  loadConfig().then(appJson => {
    ssfElectron(appJson, program.symphony, program.developer);
  }).catch(err => {
    consoleError(err.message);
    process.exit();
  });
}

function loadConfig() {
  if (program.config) {
    return readConfigFile()
      .then(data => {
        const config = JSON.parse(data);

        if (program.url) {
          // Overridden by parameter
          config.url = program.url;
        }

        if (config.url) {
          return config;
        } else {
          throw new Error('You must specify an URL (--url) or a config file containing an url (--config)');
        }
      });
  } else {
    if (program.url) {
      return Promise.resolve({
        url: program.url
      });
    } else {
      return Promise.reject(new Error('You must specify an URL (--url) or a config file containing an url (--config)'));
    }
  }
}

function readConfigFile() {
  const filePath = program.config;
  if (filePath.toLowerCase().startsWith('http://') || filePath.toLowerCase().startsWith('https://')) {
    return download(filePath);
  } else {
    return new Promise((resolve, reject) => {
      const configFile = path.join(process.cwd(), program.config);
      if (fs.existsSync(configFile)) {
        fs.readFile(configFile, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      } else {
        reject(new Error(`Config file ${configFile} does not exist`));
      }
    });
  }
}

function consoleError(err) {
  console.error('\x1b[31m', err, '\x1b[37m');
}

ssfElectron.app.ready(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
