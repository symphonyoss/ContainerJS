declare namespace ssf {

  /**
   * Options that can be passed to the notification constructor
   */
  class NotificationOptions {
    /**
     * The text to display underneath the title text.
     */
    body?: string;
    /**
     * The URL of an icon to be displayed in the notification.
     */
    icon?: string;
    /**
     *  The URL of an image to be displayed in the notification.
     */
    image?: string;
  }
  type NotificationPermission = 'default' | 'denied' | 'granted';

  interface NotificationEvent {
    /** Fires when the notification is clicked */
    click: 'click';
  }

  /**
   * Creates a new Desktop Notification.
   *
   * Notifications are created via a constructor which takes a title and
   * an options object with body text and additional view options
   * A Notification emits click events when the user clicks on it
   *
   * <pre>
   * Notification.requestPermission().then(result => {
   *   if (result === 'granted') {
   *     const notification = new Notification('My Title', { body: 'My body text' });
   * 
   *     notification.on('click', () => {
   *       // Respond to click event
   *       console.log('Notification was clicked');
   *     });
   *   }
   * })
   * </pre>
   */
  class Notification extends ssf.EventEmitter {
    /**
     * Create a notification
     * @param title - The title text of the notification.
     * @param options - The notification options.
     */
    constructor(title: string, options: NotificationOptions);

    /**
     * Request permission to create notifications
     * 
     * If required, ask the user for permission to create desktop notifications.
     * Some containers don't require permission so will resolve the promise
     * immediately with the result "granted"
     * 
     * @returns A promise which resolves to a string value "granted" or "denied".
     */
    static requestPermission(): Promise<NotificationPermission>;
  }
}
