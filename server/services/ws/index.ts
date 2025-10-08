import type { ServerResponse } from 'node:http';

import { useLogger } from '#imports';
import type { NitroApp } from 'nitropack';
import { Server as Engine } from 'engine.io';
import { Server, type Socket } from 'socket.io';
import { defineEventHandler, createError } from 'h3';
import { createAdapter } from '@socket.io/postgres-adapter';
import pg from 'pg';

import type {
  WsEventTypes,
  WsEvents,
} from '#shared/consts/ws-event-types';
import { CurrentUserNodeMiddleware } from '#server/middleware/2.current-user';

export class WebSocketService {
  static wsServer: Server;
  static pool: pg.Pool;
  static logger = useLogger().withTag('websocket');

  static setup(nitroApp: NitroApp) {
    const engine = new Engine();
    this.wsServer = new Server();
    this.wsServer.bind(engine);

    this.setupDatabase();
    this.setupMiddleware();
    this.setupRoute(nitroApp);

    this.logger.log('✅ WebSocket server is ready');
  }

  private static setupDatabase() {
    this.pool = new pg.Pool({
      host: process.env.SQX_POSTGRES_HOST!,
      port: +process.env.SQX_POSTGRES_PORT!,
      user: process.env.SQX_POSTGRES_USER,
      password: process.env.SQX_POSTGRES_PASSWORD!,
      database: process.env.SQX_POSTGRES_DB!,
    });

    this.pool.query(`
      CREATE TABLE IF NOT EXISTS socket_io_attachments (
          id          bigserial UNIQUE,
          created_at  timestamptz DEFAULT NOW(),
          payload     bytea
      );
    `);

    this.wsServer.adapter(createAdapter(this.pool));

    this.pool.on('error', (err) => {
      this.logger.error('Postgres error', err);
    });
  }

  private static setupMiddleware() {
    this.wsServer.on('connection', (socket) => {
      this.logger.log('a user connected');
      setTimeout(() => {
        socket.emit('hello', 'Hello from the server');
      }, 3000);
    });

    this.wsServer.on('disconnect', (_) => {
      this.logger.log('a user disconnected');
    });

    this.wsServer
      .of(/\/users\/\d+/)
      .use(this.authMiddleware)
      .use(this.userValidationMiddleware)
      .use(this.userIdMiddleware);
  }

  private static authMiddleware = (
    socket: Socket,
    next: (err?: Error) => void,
  ) => {
    const {
      client: { request: req },
    } = socket;
    const res = {
      setHeader: () => {},
      removeHeader: () => {},
      appendHeader: () => {},
      getHeader: () => '',
    } as unknown as ServerResponse;

    return CurrentUserNodeMiddleware(req, res, next);
  };

  private static userValidationMiddleware = (
    socket: Socket,
    next: (err?: Error) => void,
  ) => {
    if (!socket.client.request.user) {
      next(
        createError({
          statusCode: 403,
          message: 'Unauthorized',
        }),
      );
    } else {
      next();
    }
  };

  private static userIdMiddleware = (
    socket: Socket,
    next: (err?: Error) => void,
  ) => {
    const requiredUserId = +socket.nsp.name
      .split('/')
      .filter(Boolean)
      .pop()!;

    if (!requiredUserId) {
      next(
        createError({
          statusCode: 400,
          message: "Invalid user's id was given",
        }),
      );
      return;
    }

    const {
      client: {
        request: { user: currentUser },
      },
    } = socket;

    if (currentUser!.id !== requiredUserId) {
      next(
        createError({
          statusCode: 403,
          message: 'Invalid credentials',
        }),
      );
    } else {
      next();
    }
  };

  private static setupRoute(nitroApp: NitroApp) {
    const engine = new Engine();
    this.wsServer.bind(engine);

    nitroApp.router.use(
      '/socket.io/',
      defineEventHandler({
        handler(event) {
          engine.handleRequest(
            // @ts-expect-error private property
            event.node.req,
            event.node.res,
          );
          event._handled = true;
        },
        websocket: {
          open(peer) {
            // @ts-expect-error private property
            engine.prepare(peer._internal.nodeReq);
            // @ts-expect-error private property
            engine.onWebSocket(
              // @ts-expect-error private property
              peer._internal.nodeReq,
              // @ts-expect-error private property
              peer._internal.nodeReq.socket,
              peer.websocket,
            );
          },
        },
      }),
    );
  }

  static async cleanup() {
    try {
      if (this.wsServer) {
        await this.wsServer.close();
      }
      if (this.pool) {
        await this.pool.end();
      }
      this.logger.log('✅ WebSocket cleanup completed');
    } catch (error) {
      this.logger.error(
        '❌ WebSocket cleanup error:',
        error,
      );
    }
  }

  static async sendUserEvent<T extends WsEventTypes>(
    userId: number,
    type: T,
    payload: WsEvents[T],
  ) {
    return this.wsServer
      .of(`/users/${userId}`)
      .emit(type, payload);
  }
}
