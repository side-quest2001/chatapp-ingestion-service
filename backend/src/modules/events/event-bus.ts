import { EventEmitter } from "node:events";

type EventMap = Record<string, unknown>;
type EventHandler<T> = (payload: T) => void;

class TypedEventBus<TEvents extends EventMap> {
  private readonly emitter = new EventEmitter();

  on<TKey extends keyof TEvents & string>(
    eventName: TKey,
    handler: EventHandler<TEvents[TKey]>,
  ) {
    this.emitter.on(eventName, handler as EventHandler<unknown>);
  }

  emit<TKey extends keyof TEvents & string>(
    eventName: TKey,
    payload: TEvents[TKey],
  ) {
    this.emitter.emit(eventName, payload);
  }
}

export { TypedEventBus };
