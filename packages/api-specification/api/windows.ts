import {Bounds} from "./common";

export interface WindowsAPI {

    /** Returns the current window */
    current: Window;

    /** Returns all windows in the application */
    all: Window[];

    /** Opens a new window */
    open(options: WindowOptions): Promise<Window>;

    /** Receive notifications when a new window is opened */
    onWindowOpened(callback: (window: Window) => void);

    /** Receive notifications when a window was closed */
    onWindowClosed(callback: (window: Window) => void);
}

export interface WindowOptions {
    /**
     * Default window title.
     */
    name: string;

    /**
     * URL that this window loads.
     */
    url: string;

    /**
     * Window initial bounds. Can contain partial bounds (e.g width only) and be
     * combined with center
     */
    bounds: Bounds;

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

export interface Window {

    constructor(options: WindowOptions);

    /**
     * Get or set the bounds of the window.
     */
    bounds: Bounds;

    /**
     * Get or set if the window has a shadow.
     */
    hasShadow: boolean;

    /**
     * Get or set the maximum size of the window.
     */
    maximumSize: Bounds;

    /**
     * Get or set the minimum size of the window.
     */
    minimumSize: Bounds;

    /**
     * Get or set the title of the window
     */
    title: string;

    /**
     * Get or set if the window is always on top of all other windows.
     */
    alwaysOnTop: boolean;

    /**
     * Get or set if the window can be maximized.
     */
    maximizable: boolean;

    /**
     * Get or set if the window can be minimized.
     */
    minimizable: boolean;

    /**
     * Get or set if the window can be re-sized.
     */
    resizable: boolean;

    /**
     * Get or set if the window is shown in the taskbar.
     */
    skipTaskbar: boolean;

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
     * Get the child windows of the window.
     */
    getChildWindows(): Window[];

    /**
     * Get the parent of the window. Null will be returned if the window has no parent.
     */
    getParentWindow(): Window;

    /**
     * Returns the current state of the window - normal, maximized or minimized
     */
    getState(): "normal" | "maximized" | "minimized";

    /**
     * Hides the window.
     * @returns {Promise<void>} A promise that resolves to nothing when the window has hidden.
     */
    hide(): Promise<void>;

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
     * Restores the window to normal state.
     * @returns {Promise<void>} A promise that resolves to nothing when the window method succeeds.
     */
    restore(): Promise<void>;

    /**
     * Sets the window icon.
     * @param {string} icon - The url to the image.
     * @returns {Promise<void>} A promise that resolves to nothing when the option has been set.
     */
    setIcon(icon: string): Promise<void>;

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
     * Send a message to the window.
     * @param {string|object} message - The message to send to the window. Can be any serializable object.
     */
    sendMessage(message: string | object): Promise<void>;
}