declare namespace ssf {
  interface Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
  }

  interface WindowOptions {
    /**
     * Default window title.
     */
    name: string;
    /**
     * URL that this window loads.
     */
    url: string;
    /**
     * Window’s height in pixels.
     */
    height: number;
    /**
     * Window’s width in pixels.
     */
    width: number;
    /**
     * Window’s left offset from screen.
     */
    x: number;
    /**
     * Window’s top offset from screen.
     */
    y: number;
    /**
     * Window’s maximum width.
     */
    maxWidth: number;
    /**
     * Window’s minimum width.
     */
    minWidth: number;
    /**
     * Window’s maximum height.
     */
    maxHeight: number;
    /**
     * Window’s minimum height.
     */
    minHeight: number;
    /**
     * Whether the window should always stay on top of other windows. Default is false.
     */
    alwaysOnTop: boolean;
    /**
     * Window’s background color as Hexadecimal value.
     */
    backgroundColor: string;
    /**
     * Whether the window is a child of the current window. Default is false.
     */
    child: boolean;
    /**
     * Show window in the center of the screen.
     */
    center: boolean;
    /**
     * If false, creates a frameless window. Default is true.
     */
    frame: boolean;
    /**
     * Whether window should have a shadow. This is only implemented on macOS. Default is true.
     */
    hasShadow: boolean;
    /**
     * Whether window is maximizable. Default is true.
     */
    maximizable: boolean;
    /**
     * Whether window is minimizable. Default is true.
     */
    minimizable: boolean;
    /**
     * Whether window is resizable. Default is true.
     */
    resizable: boolean
    /**
     * Whether window should be shown when created. Default is true.
     */
    show: boolean;
    /**
     * Whether to show the window in taskbar. Default is false.
     */
    skipTaskbar: boolean;
    /**
     * Makes the window transparent. Default is false.
     */
    transparent: boolean;
  }

  class Window {
    innerWindow: any;

    constructor(opts: WindowOptions);

    /**
     * Removes focus from the window.
     * @returns {Promise<void>} A promise which resolves to nothing when the function has completed.
     */
    blur(): Promise<void>;

    /**
     * Closes the window.
     * @returns {Promise<void>} A promise which resolves to nothing when the function has completed.
     */
    close(): Promise<void>;

    /**
     * Flashes the window's frame and taskbar icon.
     * @param {boolean} flag - Flag to start or stop the window flashing.
     * @returns {Promise<void>} A promise which resolves to nothing when the function has completed.
     */
    flashFrame(flag: boolean): Promise<void>;

    /**
     * Focuses the window.
     * @returns {Promise<void>} A promise which resolves to nothing when the function has completed.
     */
    focus(): Promise<void>;

    /**
     * Returns the bounds of the window.
     * @returns {Promise<Rectangle>} A promise that resolves to an object specifying the bounds of the window.
     */
    getBounds(): Promise<Rectangle>;

    /**
     * Get the child windows of the window.
     * @returns {Window[]} A promise that resolves to an array of child windows.
     */
    getChildWindows(): ReadonlyArray<any>;

    /**
     * Get the maximum size of the window.
     * @returns {Promise<Number[]>} A promise that resolves to an array containing the maximum width and height of the window.
     */
    getMaximumSize(): Promise<ReadonlyArray<number>>;

    /**
     * Get the minimum size of the window.
     * @returns {Promise<Number[]>} A promise that resolves to an array containing the minimum width and height of the window.
     */
    getMinimumSize(): Promise<ReadonlyArray<number>>;

    /**
     * Get the parent of the window. Null will be returned if the window has no parent.
     * @returns {Promise<Window>} The parent window.
     */
    getParentWindow(): Promise<Window>;

    /**
     * Get the position of the window.
     * @returns {Promise<Number[]>} A promise that resolves to an array of integers containing the x and y coordinates of the window.
     */
    getPosition(): Promise<ReadonlyArray<number>>;

    /**
     * Get the width and height of the window.
     * @returns {Promise<Number[]>} A promise that resolves to an array of integers containing the width and height of the window.
     */
    getSize(): Promise<ReadonlyArray<number>>;

    /**
     * Get the title of the window
     * @returns {Promise<string>} The title of the window.
     */
    getTitle(): Promise<string>;

    /**
     * Check if the window has a shadow.
     * @returns {Promise<boolean>} A promise that resolves to a boolean stating if the window has a shadow.
     */
    hasShadow(): Promise<boolean>;

    /**
     * Hides the window.
     * @returns {Promise<void>} A promise that resolves to nothing when the window has hidden.
     */
    hide(): Promise<void>;

    /**
     * Check if the window is always on top of all other windows.
     * @returns {Promise<boolean>} A promise that resolves to a boolean stating if the window is always on top.
     */
    isAlwaysOnTop(): Promise<boolean>;

    /**
     * Check if the window can be maximized.
     * @returns {Promise<boolean>} A promise that resolves to a boolean stating if the window can be maximized.
     */
    isMaximizable(): Promise<boolean>;

    /**
     * Check if the window is currently maximized.
     * @returns {Promise<boolean>} A promise that resolves to a boolean stating if the window is maximized.
     */
    isMaximized(): Promise<boolean>;

    /**
     * Check if the window can be minimized.
     * @returns {Promise<boolean>} A promise that resolves to a boolean stating if the window can be minimized.
     */
    isMinimizable(): Promise<boolean>;

    /**
     * Check if the window is currently minimized.
     * @returns {Promise<boolean>} A promise that resolves to a boolean stating if the window is minimized.
     */
    isMinimized(): Promise<boolean>;

    /**
     * Check if the window can be resized.
     * @returns {Promise<boolean>} A promise that resolves to a boolean stating if the window can be resized.
     */
    isResizable(): Promise<boolean>;

    /**
     * Load a new URL in the window.
     * @param {string} url - The URL to load in the window.
     * @returns {Promise<void>} A promise that resolves when the window method succeeds.
     */
    loadURL(url: string): Promise<void>;

    /**
     * Reload the window.
     * @returns {Promise<void>} A promise that resolves when the window method succeeds.
     */
    reload(): Promise<void>;

    /**
     * Restores the window to the previous state.
     * @returns {Promise<void>} A promise that resolves to nothing when the window method succeeds.
     */
    restore(): Promise<void>;

    /**
     * Sets the window to always be on top of other windows.
     * @param {boolean} alwaysOnTop - Sets if the window is always on top.
     * @returns {Promise<void>} A promise that resolves to nothing when the option is set.
     */
    setAlwaysOnTop(alwaysOnTop: boolean): Promise<void>;

    /**
     * Sets the window to always be on top of other windows.
     * @param {Rectangle} bounds - Sets the bounds of the window.
     * @returns {Promise<void>} A promise that resolves to nothing when the option is set.
     */
    setBounds(bounds: Rectangle): Promise<void>;

    /**
     * Sets the window icon.
     * @param {string} icon - The url to the image.
     * @returns {Promise<void>} A promise that resolves to nothing when the option has been set.
     */
    setIcon(icon: string): Promise<void>;

    /**
     * Sets if the window can be maximized.
     * @param {boolean} maximizable - Set if the window can be maximized.
     * @returns {Promise<void>} A promise that resolves to nothing when the option has been set.
     */
    setMaximizable(maximizable: boolean): Promise<void>;

    /**
     * Sets the windows maximum size.
     * @param {Number} maxWidth - The maximum width of the window.
     * @param {Number} maxHeight - The maximum height of the window.
     * @returns {Promise<void>} A promise that resolves to nothing when the option has been set.
     */
    setMaximumSize(maxWidth: number, maxHeight: number): Promise<void>;

    /**
     * Sets if the window can be minimized.
     * @param {boolean} minimizable - Set if the window can be minimized.
     * @returns {Promise<void>} A promise that resolves to nothing when the option has been set.
     */
    setMinimizable(minimizable: boolean): Promise<void>;

    /**
     * Sets the windows minimum size.
     * @param {Number} minWidth - The minimum width of the window.
     * @param {Number} minHeight - The minimum height of the window.
     * @returns {Promise<void>} A promise that resolves to nothing when the option has been set.
     */
    setMinimumSize(minWidth: number, minHeight: number): Promise<void>;

    /**
     * Sets the windows position.
     * @param {Number} x - The x position of the window.
     * @param {Number} y - The y position of the window.
     * @returns {Promise<void>} A promise that resolves to nothing when the option has been set.
     */
    setPosition(x: number, y: number): Promise<void>;

    /**
     * Sets if the window is resizable.
     * @param {boolean} resizable - If the window can be resized.
     * @returns {Promise<void>} A promise that resolves to nothing when the option has been set.
     */
    setResizable(resizable: boolean): Promise<void>;

    /**
     * Sets the width and height of the window.
     * @param {number} width - The width of the window.
     * @param {number} height - The height of the window.
     * @returns {Promise<void>} A promise that resolves to nothing when the option has been set.
     */
    setSize(width: number, height: number): Promise<void>;

    /**
     * Sets if the window is shown in the taskbar.
     * @param {boolean} skipTaskbar - If the window is shown in the taskbar.
     * @returns {Promise<void>} A promise that resolves to nothing when the option has been set.
     */
    setSkipTaskbar(skipTaskbar: boolean): Promise<void>;

    /**
     * Show the window.
     * @returns {Promise<void>} A promise that resolves to nothing when the window is showing.
     */
    show(): Promise<void>;

    /**
     * Maximize the window.
     * @returns {Promise<void>} A promise that resolves to nothing when the window has maximized.
     */
    maximize(): Promise<void>;

    /**
     * Minimize the window.
     * @returns {Promise<void>} A promise that resolves to nothing when the window has minimized.
     */
    minimize(): Promise<void>;

    /**
     * Unmaximize the window.
     * @returns {Promise<void>} A promise that resolves to nothing when the window has unmaximized.
     */
    unmaximize(): Promise<void>;

    /**
     * Adds a listener for a particular window event.
     * @param {string} event - The event to listen for.
     * @param {function} listener - The function to call when the event fires.
     */
    addListener(event: string, listener: Function): void;

    /**
     * Removes an event listener from the window. The listener must be the same function that was passed into addListener.
     * @param {string} event - The event the listener was listening for.
     * @param {function} listener - The original function that was passed to addListener.
     */
    removeListener(event: string, listener: Function): void;

    /**
     * Removes all listeners from all window events.
     */
    removeAllListeners(): void;

    /**
     * Send a message to the window.
     * @param {string|object} message - The message to send to the window. Can be any serializable object.
     */
    postMessage(message: string | Object): void;

    /**
   * Gets the id of the current window.
   * @returns {string} The window id.
   * @static
   */
    static getCurrentWindowId(): string;

    /**
   * Gets the current window object.
   * @param {function} callback - Function that is called when the window is created successfully.
   * @param {function} errorCallback - Function that is called when the window could not be created.
   * @returns {Window} The window.
   * @static
   */
    static getCurrentWindow(callback: Function, errorCallback: Function): Window;
  }

  class MessageService {
    static send(windowId: string, topic :string, message: string|object): void;
    static subscribe(windowId: string, topic :string, listener: Function): void;
    static unsubscribe(windowId: string, topic :string, listener: Function): void;
  }

  class ScreenSnippet {
    capture(): Promise<string>;
  }

  class App {
    static ready(): Promise<any>;
  }

  class NotificationOptions {
    body?: string;
  }
}

declare interface Window {
  Notification(title: string, options: ssf.NotificationOptions): void;
}
