// &#9888; TODO Revise - are we ok with bus pub/sub (the current model) or we want to propose AGM like RPC

/**
 * Currently this is based on OpenFin bus
 */
export interface MessagesAPI{
    send(destinationUuid: string, topic: string, message: string|object): void;
    publish(topic: string, message: string|object);

    subscribe(destinationUuid: string, topic: string, listener: Function): void;
    unsubscribe(windowId: string, topic: string, listener: Function): void;
}