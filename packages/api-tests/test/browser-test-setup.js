const webdriverio = require('webdriverio');
const selenium = require('selenium-standalone');

const options = {
  desiredCapabilities: {
    browserName: 'chrome'
  }
};

class Application {
  constructor() {
    this.client = undefined;
    this.running = false;
    this.driver = undefined;
  }

  start() {
    return new Promise((resolve, reject) => {
      selenium.install((err) => {
        if (err) {
          this.running = false;
          reject(err);
        } else {
          selenium.start((err, child) => {
            if (err) {
              this.running = false;
              reject(err);
            } else {
              this.running = true;
              this.driver = child;
              this.client = webdriverio.remote(options).init().url('localhost:5000/index.html');
              this.client.timeouts('script', 60000);
              this.client.getWindowCount = () => {
                return this.client.windowHandles().then(handles => handles.value.length);
              };
              resolve();
            }
          });
        }
      });
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
