/**
 * Currently this is based on OpenFin InterApplicationBus - http://cdn.openfin.co/jsdocs/stable/fin.desktop.InterApplicationBus.html
 *
 * TBD - Request/response and streaming
 */
export interface MessagesAPI{
    send(windowId: string, topic :string, message: string|object): void;
    subscribe(windowId: string, topic :string, listener: Function): void;
    unsubscribe(windowId: string, topic :string, listener: Function): void;
}