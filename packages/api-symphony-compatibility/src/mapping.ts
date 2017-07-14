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
    static setBadgeCount(Number: number) {
      // Not implemented in containerjs
      return;
    }

    /** API defined at https://symphonyoss.atlassian.net/wiki/display/WGDWAPI/getMediaSources+API */
    static getMediaSources(options: any, callback: Function) {
      // Not implemented in containerjs
      return;
    }

    /** API defined at https://symphonyoss.atlassian.net/wiki/display/WGDWAPI/RegisterBoundsChange+API */
    static registerBoundsChange(callback: Function) {
      // Not fully implemented in containerjs, only listens to the current window, not its children as well
      containerjsSsf.Window.getCurrentWindow().addListener('resize', () => {
        containerjsSsf.Window.getCurrentWindow().getBounds().then((bounds) => {
          callback(bounds);
        });
      });
      containerjsSsf.Window.getCurrentWindow().addListener('move', () => {
        containerjsSsf.Window.getCurrentWindow().getBounds().then((bounds) => {
          callback(bounds);
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
  }

  export namespace ssf {
    /** API defined at https://symphonyoss.atlassian.net/wiki/display/WGDWAPI/ScreenSnippet+API */
    export class ScreenSnippet {
      capture() {
        return new containerjsSsf.ScreenSnippet().capture();
      }
    }
  }
}
