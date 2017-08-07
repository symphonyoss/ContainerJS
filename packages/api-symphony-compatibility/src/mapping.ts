const containerjsSsf = ssf;

export namespace map {
  export class ssf {
    /** API defined at https://symphonyoss.atlassian.net/wiki/display/WGDWAPI/Activate+API */
    static activate(windowName: string) {
      // Could use window.focus in containerjs, but no way of selecting window by name yet
      return;
    }

    /** API defined at https://symphonyoss.atlassian.net/wiki/display/WGDWAPI/Activity+API */
    static registerActivityDetection(throttle: number, callback: Function) {
      // Not implemented in containerjs
      return;
    }

    /** API defined at https://symphonyoss.atlassian.net/wiki/display/WGDWAPI/BadgeCount+API */
    static setBadgeCount(count: number) {
      // See: https://github.com/symphonyoss/ContainerJS/issues/318
      (containerjsSsf as any).app.setBadgeCount(count);
    }

    /** API defined at https://symphonyoss.atlassian.net/wiki/display/WGDWAPI/getMediaSources+API */
    static getMediaSources(options: any, callback: Function) {
      // Not implemented in containerjs
      return;
    }

    /** API defined at https://symphonyoss.atlassian.net/wiki/display/WGDWAPI/RegisterBoundsChange+API */
    static registerBoundsChange(callback: Function) {
      // Not fully implemented in containerjs, only listens to the current window, not its children as well
      containerjsSsf.Window.getCurrentWindow(win => {
        win.addListener('resize', () => {
          win.getBounds().then((bounds) => {
            callback(bounds);
          });
        });
        win.addListener('move', () => {
          win.getBounds().then((bounds) => {
            callback(bounds);
          });
        });
      });
    }

    /** API defined at https://symphonyoss.atlassian.net/wiki/display/WGDWAPI/Version+API */
    static getVersionInfo() {
      // Not implemented in containerjs
      return new Promise((resolve, reject) => {
        reject(new Error('Not currently implemented'));
      });
    }

    static registerLogger() {
      // We don't have any need to register a logger for the API layer
    }
  }

  export namespace ssf {
    /** API defined at https://symphonyoss.atlassian.net/wiki/display/WGDWAPI/ScreenSnippet+API */
    export class ScreenSnippet {
      capture() {
        return new containerjsSsf.Window().capture();
      }
    }

    export class Notification {
      constructor(title: string, options: NotificationOptions) {
        return new containerjsSsf.Notification(title, options);
      }

      static permission: string = 'granted';
    }
  }
}
