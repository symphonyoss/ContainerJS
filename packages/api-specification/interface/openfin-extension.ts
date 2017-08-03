/**
 * @ignore
 * @hidden
 */
declare namespace fin {
  interface OpenFinWindow {
    uuid: string;
    executeJavaScript(code: string, callback?: Function, errorCallback?: Function): void;
  }

  interface WindowOptions {
    preload?: string;
    title?: string;
    shadow?: boolean;
  }
}
