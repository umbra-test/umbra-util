declare type EventArgs<EventMap, Event extends keyof EventMap> = EventMap[Event] extends any[] ? EventMap[Event] : [EventMap[Event]];
declare type EventCallback<EventMap, Event extends keyof EventMap> = (...args: EventArgs<EventMap, Event>) => void;
declare function union<T>(arrayA: T[] | undefined, arrayB: T[] | undefined): T[];
declare function without<T>(array: T[] | undefined, item: T): T[];
declare class SimpleEventEmitter<EventMap> {
    private readonly onListeners;
    private readonly onceListeners;
    on<Event extends keyof EventMap>(event: Event, callback: EventCallback<EventMap, Event>): void;
    once<Event extends keyof EventMap>(event: Event, callback: EventCallback<EventMap, Event>): void;
    off<Event extends keyof EventMap>(event: Event, callback: EventCallback<EventMap, Event>): void;
    emit<Event extends keyof EventMap>(event: Event, ...args: EventArgs<EventMap, Event>): void;
    emitAndWaitForCompletion<Event extends keyof EventMap>(event: Event, ...args: EventArgs<EventMap, Event>): Promise<void>;
}
export { EventArgs, EventCallback, SimpleEventEmitter, union, without };
