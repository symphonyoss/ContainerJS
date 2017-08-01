/// <reference types="electron" />
/// <reference types="openfin" />

// Needed to access the browsers window object
type BrowserWindow = Window;

declare namespace ssf {

  /**
   * Options that can be passed to the window constructor
   */
  interface WindowOptions {
    /**
     * Default window title.
     */
    name?: string;
    /**
     * URL that this window loads.
     */
    url: string;
    /**
     * Window’s height in pixels.
     */
    height?: number;
    /**
     * Window’s width in pixels.
     */
    width?: number;
    /**
     * Window’s left offset from screen.
     */
    x?: number;
    /**
     * Window’s top offset from screen.
     */
    y?: number;
    /**
     * Window’s maximum width.
     */
    maxWidth?: number;
    /**
     * Window’s minimum width.
     */
    minWidth?: number;
    /**
     * Window’s maximum height.
     */
    maxHeight?: number;
    /**
     * Window’s minimum height.
     */
    minHeight?: number;
    /**
     * Whether the window should always stay on top of other windows. Default is false.
     */
    alwaysOnTop?: boolean;
    /**
     * Window’s background color as Hexadecimal value.
     */
    backgroundColor?: string;
    /**
     * Whether the window is a child of the current window. Default is false.
     */
    child?: boolean;
    /**
     * Show window in the center of the screen.
     */
    center?: boolean;
    /**
     * If false, creates a frameless window. Default is true.
     */
    frame?: boolean;
    /**
     * Whether window should have a shadow. This is only implemented on macOS. Default is true.
     */
    hasShadow?: boolean;
    /**
     * Whether window is maximizable. Default is true.
     */
    maximizable?: boolean;
    /**
     * Whether window is minimizable. Default is true.
     */
    minimizable?: boolean;
    /**
     * Whether window is resizable. Default is true.
     */
    resizable?: boolean;
    /**
     * Whether window should be shown when created. Default is true.
     */
    show?: boolean;
    /**
     * Whether to show the window in taskbar. Default is false.
     */
    skipTaskbar?: boolean;
    /**
     * Makes the window transparent. Default is false.
     */
    transparent?: boolean;
    /**
     * The id of the display to show the window on. If no id is passed in, the x and y position
     * of the window is relative to the primary monitor.
     */
    display?: string;
  }

  interface WindowEvent {
    /** Fires when the window has been blurred */
    blur: 'blur';

    /** Fires when the window has closed */
    closed: 'closed';

    /** Fires when the window has been focused */
    focus: 'focus';

    /** Fires when the window has been hidden */
    hide: 'hide';

    /** Fires when the window has been maximized */
    maximize: 'maximize';

    /** Fires when the window has been minimized */
    minimize: 'minimize';

    /** Fires when the window has been moved */
    move: 'move';

    /** Fires when the window has been resized */
    resize: 'resize';

    /** Fires when the window has been restored */
    restore: 'restore';

    /** Fires when the window has been shown */
    show: 'show';
  }

  export abstract class WindowCore extends ssf.EventEmitter {
    /**
     * The id that uniquely identifies the window
     */
    id: string;

    /**
     * The native window for the platform the API is running on.
     */
    innerWindow: Electron.BrowserWindow | fin.OpenFinWindow | BrowserWindow;

    /**
     * Create a new window.
     * @param opts A window options object
     * @param callback A callback that is called if the window creation succeeds
     * @param errorCallback A callback that is called if window creation fails
     */
    constructor(opts?: WindowOptions, callback?: (window: Window) => void, errorCallback?: () => void);

    /**
     * Removes focus from the window.
     */
    blur(): Promise<void>;

    /**
     * Closes the window. Only works on windows created via the ContainerJS API in the browser.
     * @returns A promise which resolves to nothing when the function has completed.
     */
    close(): Promise<void>;

    /**
     * Focuses the window.
     * @returns A promise which resolves to nothing when the function has completed.
     */
    focus(): Promise<void>;

    /**
     * Returns the bounds of the window.
     * @returns A promise that resolves to an object specifying the bounds of the window.
     */
    getBounds(): Promise<ssf.Rectangle>;

    /**
     * Get the child windows of the window.
     * @returns A promise that resolves to an array of child windows.
     */
    getChildWindows(): Promise<ReadonlyArray<Window>>;

    /**
     * Gets the id of the window.
     * @returns The window id.
     */
    getId(): string;

    /**
     * Get the parent of the window. Null will be returned if the window has no parent.
     * @returns The parent window.
     */
    getParentWindow(): Promise<Window|WindowCore>;

    /**
     * Get the position of the window.
     * @returns A promise that resolves to an array of integers containing the x and y coordinates of the window.
     */
    getPosition(): Promise<ReadonlyArray<number>>;

    /**
     * Get the width and height of the window.
     * @returns A promise that resolves to an array of integers containing the width and height of the window.
     */
    getSize(): Promise<ReadonlyArray<number>>;

    /**
     * Get the title of the window
     * @returns The title of the window.
     */
    getTitle(): Promise<string>;

    /**
     * Check if the window can be maximized.
     * @returns A promise that resolves to a boolean stating if the window can be maximized.
     */
    isMaximizable(): Promise<boolean>;

    /**
     * Check if the window can be minimized.
     * @returns A promise that resolves to a boolean stating if the window can be minimized.
     */
    isMinimizable(): Promise<boolean>;

    /**
     * Check if the window can be resized.
     * @returns A promise that resolves to a boolean stating if the window can be resized.
     */
    isResizable(): Promise<boolean>;

    /**
     * Load a new URL in the window.
     * @param url - The URL to load in the window.
     * @returns A promise that resolves when the window method succeeds.
     */
    loadURL(url: string): Promise<void>;

    /**
     * Reload the window.
     * @returns A promise that resolves when the window method succeeds.
     */
    reload(): Promise<void>;

    /**
     * Sets the window to always be on top of other windows. Only works on windows created via the ContainerJS API in the browser.
     * @param bounds - Sets the bounds of the window.
     * @returns A promise that resolves to nothing when the option is set.
     */
    setBounds(bounds: ssf.Rectangle): Promise<void>;

    /**
     * Sets the windows position. Only works on windows created via the ContainerJS API in the browser.
     * @param x - The x position of the window.
     * @param y - The y position of the window.
     * @returns A promise that resolves to nothing when the option has been set.
     */
    setPosition(x: number, y: number): Promise<void>;

    /**
     * Sets the width and height of the window. Only works on windows created via the ContainerJS API in the browser.
     * @param width - The width of the window.
     * @param height - The height of the window.
     * @returns A promise that resolves to nothing when the option has been set.
     */
    setSize(width: number, height: number): Promise<void>;

    /**
     * Send a message to the window.
     * @param message - The message to send to the window. Can be any serializable object.
     */
    postMessage(message: string | Object): void;

    /**
     * Gets the current window object.
     * @param callback - Function that is called when the window is created successfully.
     * @param errorCallback - Function that is called when the window could not be created.
     * @returns The window.
     */
    static getCurrentWindow(callback?: () => void, errorCallback?: () => void): Window;

    /**
     * Wraps a native container window with a ContainerJS window.
     * @param window The native window to wrap.
     */
    static wrap(window: Electron.BrowserWindow | fin.OpenFinWindow | BrowserWindow): Window;

    /**
     * Captures the current visible content for the given Window. Returns the image as a base64 encoded png string.
     *
     * Note: For the browser, this is limited by the usual cross-domain rules.
     */
    capture(): Promise<string>;
  }

   /**
    * Creates and controls windows.
    *
    * Windows are created via a constructor which takes a configuration object
    * that details the window's behaviour.
    *
    * <pre>
    * const win = new Window({url: 'http://localhost/index.html'});
    * </pre>
    */
  export class Window extends WindowCore {
    /**
     * Flashes the window's frame and taskbar icon.
     * @param flag - Flag to start or stop the window flashing.
     * @returns A promise which resolves to nothing when the function has completed.
     */
    flashFrame(flag: boolean): Promise<void>;

    /**
     * Get the maximum size of the window.
     * @returns A promise that resolves to an array containing the maximum width and height of the window.
     */
    getMaximumSize(): Promise<ReadonlyArray<number>>;

    /**
     * Get the minimum size of the window.
     * @returns A promise that resolves to an array containing the minimum width and height of the window.
     */
    getMinimumSize(): Promise<ReadonlyArray<number>>;

    /**
     * Check if the window has a shadow.
     * @returns A promise that resolves to a boolean stating if the window has a shadow.
     */
    hasShadow(): Promise<boolean>;

    /**
     * Hides the window.
     * @returns A promise that resolves to nothing when the window has hidden.
     */
    hide(): Promise<void>;

    /**
     * Check if the window is always on top of all other windows.
     * @returns A promise that resolves to a boolean stating if the window is always on top.
     */
    isAlwaysOnTop(): Promise<boolean>;

    /**
     * Check if the window is currently maximized.
     * @returns A promise that resolves to a boolean stating if the window is maximized.
     */
    isMaximized(): Promise<boolean>;

    /**
     * Check if the window is currently minimized.
     * @returns A promise that resolves to a boolean stating if the window is minimized.
     */
    isMinimized(): Promise<boolean>;

    /**
     * Check is the window is currently visible
     * @returns A promise that resolves to a boolean stating if the window is visible
     */
    isVisible(): Promise<boolean>;

    /**
     * Restores the window to the previous state.
     * @returns A promise that resolves to nothing when the window method succeeds.
     */
    restore(): Promise<void>;

    /**
     * Sets the window to always be on top of other windows.
     * @param alwaysOnTop - Sets if the window is always on top.
     * @returns A promise that resolves to nothing when the option is set.
     */
    setAlwaysOnTop(alwaysOnTop: boolean): Promise<void>;

    /**
     * Sets the window to always be on top of other windows.
     * @param bounds - Sets the bounds of the window.
     * @returns A promise that resolves to nothing when the option is set.
     */
    setBounds(bounds: ssf.Rectangle): Promise<void>;

    /**
     * Sets the window icon.
     * @param icon - The url to the image.
     * @returns A promise that resolves to nothing when the option has been set.
     */
    setIcon(icon: string): Promise<void>;

    /**
     * Sets if the window can be maximized.
     * @param maximizable - Set if the window can be maximized.
     * @returns A promise that resolves to nothing when the option has been set.
     */
    setMaximizable(maximizable: boolean): Promise<void>;

    /**
     * Sets the windows maximum size.
     * @param maxWidth - The maximum width of the window.
     * @param maxHeight - The maximum height of the window.
     * @returns A promise that resolves to nothing when the option has been set.
     */
    setMaximumSize(maxWidth: number, maxHeight: number): Promise<void>;

    /**
     * Sets if the window can be minimized.
     * @param minimizable - Set if the window can be minimized.
     * @returns A promise that resolves to nothing when the option has been set.
     */
    setMinimizable(minimizable: boolean): Promise<void>;

    /**
     * Sets the windows minimum size.
     * @param minWidth - The minimum width of the window.
     * @param minHeight - The minimum height of the window.
     * @returns A promise that resolves to nothing when the option has been set.
     */
    setMinimumSize(minWidth: number, minHeight: number): Promise<void>;

    /**
     * Sets the windows position.
     * @param x - The x position of the window.
     * @param y - The y position of the window.
     * @returns A promise that resolves to nothing when the option has been set.
     */
    setPosition(x: number, y: number): Promise<void>;

    /**
     * Sets if the window is resizable.
     * @param resizable - If the window can be resized.
     * @returns A promise that resolves to nothing when the option has been set.
     */
    setResizable(resizable: boolean): Promise<void>;

    /**
     * Sets the width and height of the window.
     * @param width - The width of the window.
     * @param height - The height of the window.
     * @returns A promise that resolves to nothing when the option has been set.
     */
    setSize(width: number, height: number): Promise<void>;

    /**
     * Sets if the window is shown in the taskbar.
     * @param skipTaskbar - If the window is shown in the taskbar.
     * @returns A promise that resolves to nothing when the option has been set.
     */
    setSkipTaskbar(skipTaskbar: boolean): Promise<void>;

    /**
     * Show the window.
     * @returns A promise that resolves to nothing when the window is showing.
     */
    show(): Promise<void>;

    /**
     * Maximize the window.
     * @returns A promise that resolves to nothing when the window has maximized.
     */
    maximize(): Promise<void>;

    /**
     * Minimize the window.
     * @returns A promise that resolves to nothing when the window has minimized.
     */
    minimize(): Promise<void>;

    /**
     * Unmaximize the window.
     * @returns A promise that resolves to nothing when the window has unmaximized.
     */
    unmaximize(): Promise<void>;

    /**
     * Get the window object with a particular id. Returns null if no window with that id exists.
     * @param id The id of the window.
     */
    static getById(id: string): Promise<Window>;

    /**
     * Returns all of the current windows.
     */
    static getAll(): Promise<Array<Window>>;
  }
}
