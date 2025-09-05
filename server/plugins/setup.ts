import { defineNitroPlugin } from 'nitropack/runtime';
import { DatabaseService } from '../services/db';
import { TasksManager } from '../tasks';
import { WebSocketService } from '../services/ws';
import { MailService } from '../services/mail';

export default defineNitroPlugin((nitroApp) => {
  const setup = async () => {
    console.log('⏳ Server not ready, waiting...');

    await DatabaseService.setup();

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

    await DatabaseService.cleanup();
  };

  setup();

  nitroApp.hooks.hookOnce('close', teardown);
});
