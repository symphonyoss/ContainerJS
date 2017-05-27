/**
 * Currently this is based on OpenFin InterApplicationBus
 * http://cdn.openfin.co/jsdocs/stable/fin.desktop.InterApplicationBus.html
 */
export interface MessagesAPI{
    send(destinationUuid: string, topic: string, message: string|object): void;
    publish(topic: string, message: string|object);

    subscribe(destinationUuid: string, topic: string, listener: Function): void;
    unsubscribe(windowId: string, topic: string, listener: Function): void;
}