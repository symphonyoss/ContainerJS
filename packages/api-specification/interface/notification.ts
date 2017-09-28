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
    /**
     * The URL of the notification template for OpenFin. Can be
     * relative to the current URL. Default: "template.html"
     */
    template?: string;
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
   * an options object with body text and additional view options.
   *
   * A Notification emits click events when the user clicks on it
   *
   * <pre>
   * ssf.Notification.requestPermission().then(result => {
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
   *
   * OpenFin requires a template html file to render the notification.
   * A template (notification.html) is included with the containerjs bundle,
   * and by default ssf.Notification will try to find it in the same location
   * as the current URL. To specify a different URL for the template, set the
   * template setting in NotificationOptions
   *
   * <pre>
   *     const notification = new ssf.Notification(
   *       'My Title',
   *       {
   *         body: 'My body text',
   *         template: '/resource/notification.html'
   *       });
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
