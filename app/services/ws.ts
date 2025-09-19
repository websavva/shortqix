import { io, type Socket } from 'socket.io-client';

import type { WsEvents } from '#shared/consts/ws-event-types';

export interface WsEventListener<K extends keyof WsEvents> {
  (payload: WsEvents[K]): void | Promise<void>;
}

type WsServerEventListenersMap = Map<
  keyof WsEvents,
  Set<WsEventListener<keyof WsEvents>>
>;

export class WsService {
  private socket: Socket | null = null;
  public listenersMap: WsServerEventListenersMap =
    new Map();

  constructor(public userId: number) {}

  private createSocket() {
    this.socket = io(`/users/${this.userId}`, {
      withCredentials: true,
      reconnectionAttempts: 10,
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      console.log('connected to websocket');
    });

    this.socket.on('disconnect', () => {
      console.log('disconnected from websocket');
    });
  }

  private disconnectSocket() {
    this.socket?.disconnect();
    this.socket = null;
  }

  public on<K extends keyof WsEvents>(
    event: K,
    listener: WsEventListener<K>,
  ) {
    if (this.listenersMap.has(event)) {
      // @ts-expect-error - this is a hack to get the type of the listener
      this.listenersMap.get(event)?.add(listener);
    } else {
      // @ts-expect-error - this is a hack to get the type of the listener
      this.listenersMap.set(event, new Set([listener]));
    }

    if (!this.socket) this.createSocket();

    // @ts-expect-error - this is a hack to get the type of the listener
    this.socket.on(event, listener);

    return () => {
      this.off(event, listener);
    };
  }

  public off<K extends keyof WsEvents>(
    event: K,
    listener: WsEventListener<K>,
  ) {
    const listeners = this.listenersMap.get(event);

    if (listeners) {
      // @ts-expect-error - this is a hack to get the type of the listener
      listeners.delete(listener);

      if (!listeners.size) this.listenersMap.delete(event);
    }
    // @ts-expect-error - this is a hack to get the type of the listener
    this.socket.off(event, listener);

    if (!this.listenersMap.size) this.disconnectSocket();
  }

  public destroy() {
    for (const [event, listeners] of this.listenersMap) {
      for (const listener of listeners) {
        // @ts-expect-error - this is a hack to get the type of the listener
        this.socket.off(event, listener);
      }
    }

    this.disconnectSocket();
  }

  static create(userId: number) {
    return new WsService(userId);
  }

  static from(
    userId: number,
    listenersMap: WsServerEventListenersMap,
  ) {
    const wsService = new WsService(userId);

    const copiedListenersMap = new Map(
      Object.entries(listenersMap).map(
        ([event, listeners]) => [event, new Set(listeners)],
      ),
    ) as WsServerEventListenersMap;

    wsService.listenersMap = copiedListenersMap;

    return wsService;
  }
}
