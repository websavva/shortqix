import { defineNitroPlugin } from 'nitropack/runtime';
import { useLogger } from '#imports';

import { DatabaseService } from '#server/services/db';
import { TasksManager } from '#server/tasks';
import { WebSocketService } from '#server/services/ws';
import { MailService } from '#server/services/mail';

export default defineNitroPlugin((nitroApp) => {
  const logger = useLogger().withTag('setup');
  const errorLogger = logger.withTag('error');

  nitroApp.hooks.hook('error', (error) => {
    errorLogger.debug('❌ Server error:', error);
  });

  const setup = async () => {
    logger.log('⏳ Server not ready, waiting...');

    await DatabaseService.setup();

    await MailService.setup();

    await TasksManager.setup();

    WebSocketService.setup(nitroApp);

    nitroApp.isReady = true;

    logger.log('✅ Server is now ready');
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
