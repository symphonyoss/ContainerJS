declare namespace ssf {
  class MessageService {
    /**
     * Send a message to a specific window
     * @param windowId - The id of the window to send the message to.
     * @param topic - The topic of the message.
     * @param message - The message to send.
     */
    static send(windowId: string, topic: string, message: string|object): void;

    /**
     * Subscribe to message from a window/topic
     * @param windowId - The id of the window to listen to messages fron. Can be a wildcard '*' to listen to all windows.
     * @param topic - The topic to listen for.
     * @param listener - The function to run when a message is received. The message is passed as a parameter to the function.
     */
    static subscribe(windowId: string, topic: string, listener: Function): void;

    /**
     * Unsubscribe from a window/topic
     * @param windowId - The id of the window that the listener was subscribed to or the wildcard '*'.
     * @param topic - The topic that was being listened to.
     * @param listener - The function that was passed to subscribe. _Note:_ this must be the same function object.
     */
    static unsubscribe(windowId: string, topic: string, listener: Function): void;
  }
}
