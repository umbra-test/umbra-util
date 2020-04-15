import {union, without} from "./ArrayUtils";

type EventArgs<EventMap, Event extends keyof EventMap> = EventMap[Event] extends any[] ? EventMap[Event] : [EventMap[Event]];
type EventCallback<EventMap, Event extends keyof EventMap> = (...args: EventArgs<EventMap, Event>) => void;

/**
 * A ridiculously simple event emitter with typesafety.
 *
 * TODO: Maybe opensource this under its own package in the future.
 */
class SimpleEventEmitter<EventMap> {

    // All event arrays are dynamically filled when calling on/onc.
    private readonly onListeners: { [Event in keyof EventMap]?: EventCallback<EventMap, Event>[] } = {};
    private readonly onceListeners: { [Event in keyof EventMap]?: EventCallback<EventMap, Event>[] } = {};

    public on<Event extends keyof EventMap>(event: Event, callback: EventCallback<EventMap, Event>): void {
        (this.onListeners[event]) = union(this.onListeners[event], [callback]);
    }

    public once<Event extends keyof EventMap>(event: Event, callback: EventCallback<EventMap, Event>): void {
        this.onceListeners[event] = union(this.onceListeners[event], [callback]);
    }

    public off<Event extends keyof EventMap>(event: Event, callback: EventCallback<EventMap, Event>): void {
        this.onListeners[event] = without(this.onListeners[event], callback);
        this.onceListeners[event] = without(this.onceListeners[event], callback);
    }

    public emit<Event extends keyof EventMap>(event: Event, ...args: EventArgs<EventMap, Event>): void {
        if (this.onListeners[event]) {
            for (const callback of this.onListeners[event]!) {
                (callback as any).call(null, ...args);
            }
        }

        if (this.onceListeners[event] && this.onceListeners[event]!.length > 0) {
            for (const callback of this.onceListeners[event]!) {
                (callback as any).call(null, ...args);
            }

            this.onceListeners[event] = [];
        }
    }

    /**
     * Evaluates each function synchronously, but waits for all to asynchronously complete before returning.
     *
     * TODO: Find a better name for this.
     *
     * @param event - The event to emit.
     * @param args - All args to be emitted for the event.
     */
    public emitAndWaitForCompletion<Event extends keyof EventMap>(event: Event, ...args: EventArgs<EventMap, Event>): Promise<void> {
        const promises: Promise<void>[] = [];
        if (this.onListeners[event]) {
            for (const callback of this.onListeners[event]!) {
                try {
                    promises.push(Promise.resolve((callback as any).call(null, ...args)));
                } catch (e) {
                    promises.push(Promise.reject(e));
                }
            }
        }

        if (this.onceListeners[event] && this.onceListeners[event]!.length > 0) {
            for (const callback of this.onceListeners[event]!) {
                try {
                    promises.push(Promise.resolve((callback as any).call(null, ...args)));
                } catch (e) {
                    promises.push(Promise.reject(e));
                }
            }

            this.onceListeners[event] = [];
        }

        return Promise.all(promises).then((results) => {
            // Intentionally blank, as we want to swallow all actual "valid" values.
            return;
        });
    }
}

export {EventArgs, EventCallback, SimpleEventEmitter};
