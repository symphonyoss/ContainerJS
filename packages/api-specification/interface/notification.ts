declare namespace ssf {
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

  class Notification extends ssf.EventEmitter {
    /**
     * Create a notification
     * @param title - The title text of the notification.
     * @param options - The notification options.
     */
    constructor(title: string, options: NotificationOptions);

    static requestPermission(): Promise<NotificationPermission>;
  }
}
