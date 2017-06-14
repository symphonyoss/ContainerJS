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
  constructor(timeout) {
    this.client = undefined;
    this.running = false;
    this.driver = undefined;
    this.installed = false;
    this.timeout = timeout;
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
        this.client.timeouts('script', this.timeout);
        this.client.timeouts('implicit', this.timeout);
        // old type 'page load' needed for some browsers
        this.client.timeouts('page load', this.timeout);
        this.client.timeouts('pageLoad', this.timeout);
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

module.exports = (timeout) => {
  return new Application(timeout);
};
