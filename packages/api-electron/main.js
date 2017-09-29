const { app } = require('electron');
const ssfElectron = require('./index.js');
const fs = require('fs');
const program = require('commander');
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
  const appJson = loadConfig();
  if (appJson) {
    ssfElectron(appJson, program.symphony, program.developer);
  } else {
    process.exit();
  }
}

function loadConfig() {
  // the config json is passed to the ssf-electron bin script
  const configFile = program.config ? process.cwd() + '/' + program.config : null;
  const launchUrl = program.url;
  if (configFile) {
    if (fs.existsSync(configFile)) {
      const config = JSON.parse(fs.readFileSync(configFile, 'utf8'));

      if (launchUrl) {
        // Overridden by parameter
        config.url = launchUrl;
      }

      if (config.url) {
        return config;
      }
    } else {
      fileError(configFile, 'Config file does not exist');
      return null;
    }
  } else {
    if (launchUrl) {
      return {
        url: launchUrl
      };
    }
  }

  consoleError('You must specify an URL (--url) or a config file containing an url (--config)');
  return null;
}

function fileError(filename, err) {
  consoleError('Error with file: ' + filename);
  consoleError(err);
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
