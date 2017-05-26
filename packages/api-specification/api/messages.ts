// Revise - are we ok with bus pub/sub (the current model) or we want RPC
export interface MessagesAPI{
    send(windowId: string, topic: string, message: string|object): void;
    subscribe(windowId: string, topic: string, listener: Function): void;
    unsubscribe(windowId: string, topic: string, listener: Function): void;
}