declare namespace ssf {
  /**
   * Send messages between windows
   *
   * Messages can be sent between windows that are part of the same application.
   * Subscribe to messages based on a topic name, and either send messages
   * from or to a particular window id, or else distribute to all listening windows
   *
   * <pre>
   *   // Listen for messages from any window with the subject "test-subject"
   *   ssf.MessageService.subscribe('*', 'test-subject', (message, sender) => {
   *     console.log(`${message} from ${sender}`);
   *   });
   *
   *   // Send a message to all windows listening to "test-subject"
   *   ssf.MessageService.send('*', 'test-subject', 'This is a test message');
   * </pre>
   */
  class MessageService {
    /**
     * Send a message to a specific window
     * @param windowId - The id of the window to send the message to. Can be a wildcard '*' to send to all listening windows.
     * @param topic - The topic of the message.
     * @param message - The message to send.
     */
    static send(windowId: string, topic: string, message: string|object): void;

    /**
     * Subscribe to message from a window/topic
     * @param windowId - The id of the window to listen to messages from. Can be a wildcard '*' to listen to all windows.
     * @param topic - The topic to listen for.
     * @param listener - The function to run when a message is received. The message and sender window id are passed as a parameter to the function.
     */
    static subscribe(windowId: string, topic: string, listener: (message: string|object, sender: string) => void): void;

    /**
     * Unsubscribe from a window/topic
     * @param windowId - The id of the window that the listener was subscribed to or the wildcard '*'.
     * @param topic - The topic that was being listened to.
     * @param listener - The function that was passed to subscribe. _Note:_ this must be the same function object.
     */
    static unsubscribe(windowId: string, topic: string, listener: (message: string|object, sender: string) => void): void;
  }
}
