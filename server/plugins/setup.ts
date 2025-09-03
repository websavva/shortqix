import { initializeDatabase } from '../db';
import { smtpTransport } from '../services/smtp';

import { setupTasks } from '../tasks';
import { WebSocketService } from '../services/ws';

export default defineNitroPlugin((nitroApp) => {
  let disconnectDatabase: (() => Promise<any>) | undefined;
  let stopTasks: (() => Promise<any>) | undefined;

  WebSocketService.setup(nitroApp);

  const setup = async () => {
    console.log('⏳ Server not ready, waiting...');

    disconnectDatabase = await initializeDatabase();

    await smtpTransport.verify();

    stopTasks = await setupTasks();

    nitroApp.isReady = true;

    console.log('✅ Server is now ready');
  };

  const teardown = async () => {
    await WebSocketService.cleanup();

    await stopTasks?.();

    await disconnectDatabase?.();
  };

  setup();

  nitroApp.hooks.hookOnce('close', teardown);
});
