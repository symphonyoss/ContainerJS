const webdriverio = require('webdriverio');
const selenium = require('selenium-standalone');

const options = {
  drivers: {
    chrome: {
      version: '2.27',
      arch: process.arch,
      baseURL: 'https://chromedriver.storage.googleapis.com'
    }
  },
  desiredCapabilities: {
    browserName: 'chrome',
    chromeOptions: {
      // Disables "Chrome is being controlled by testing software" banner.
      args: ['disable-infobars']
    }
  }
};

// This is designed to replicate the Spectron Application object, apart from launching chrome instead of Electron.
class Application {
  constructor() {
    this.client = undefined;
    this.running = false;
    this.driver = undefined;
    this.installed = false;
  }

  start() {
    return new Promise((resolve, reject) => {
      if (!this.installed) {
        selenium.install((err) => {
          if (err) {
            this.running = false;
            reject(err);
          } else {
            this.installed = true;
            this.startSelenium(resolve, reject);
          }
        });
      } else {
        this.startSelenium(resolve, reject);
      }
    });
  }

  startSelenium(resolve, reject) {
    selenium.start((err, child) => {
      if (err) {
        this.running = false;
        reject(err);
      } else {
        this.running = true;
        this.driver = child;
        // Start chrome at index.html
        this.client = webdriverio.remote(options).init().url('http://localhost:5000/index.html');
        this.client.timeouts('script', 60000);
        this.client.timeouts('implicit', 60000);
        // old type 'page load' needed for some browsers
        this.client.timeouts('page load', 60000);
        this.client.timeouts('pageLoad', 60000);
        // Implements the spectron helper method
        this.client.getWindowCount = () => {
          return this.client.windowHandles().then(handles => handles.value.length);
        };

        resolve();
      }
    });
  }

  stop() {
    this.running = false;
    this.client.end();
  }

  restart() {
    this.stop();
    this.start();
  }

  isRunning() {
    return this.running;
  }
};

module.exports = () => {
  return new Application();
};
