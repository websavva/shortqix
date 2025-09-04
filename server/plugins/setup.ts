import { initializeDatabase } from '../db';

import { TasksManager } from '../tasks';
import { WebSocketService } from '../services/ws';
import { MailService } from '../services/mail';

export default defineNitroPlugin((nitroApp) => {
  let disconnectDatabase: (() => Promise<any>) | undefined;

  const setup = async () => {
    console.log('⏳ Server not ready, waiting...');

    disconnectDatabase = await initializeDatabase();

    await MailService.setup();

    await TasksManager.setup();

    WebSocketService.setup(nitroApp);

    nitroApp.isReady = true;

    console.log('✅ Server is now ready');
  };

  const teardown = async () => {
    await WebSocketService.cleanup();

    await TasksManager.cleanup();

    await MailService.cleanup();

    await disconnectDatabase?.();
  };

  setup();

  nitroApp.hooks.hookOnce('close', teardown);
});
