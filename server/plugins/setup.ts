import { initializeDatabase } from '../db';
import { smtpTransport } from '../services/smtp';

import { TasksManager } from '../tasks';
import { WebSocketService } from '../services/ws';

export default defineNitroPlugin((nitroApp) => {
  let disconnectDatabase: (() => Promise<any>) | undefined;

  const setup = async () => {
    console.log('⏳ Server not ready, waiting...');
    
    disconnectDatabase = await initializeDatabase();
    
    await smtpTransport.verify();
    
    await TasksManager.setup();
    
    WebSocketService.setup(nitroApp);

    nitroApp.isReady = true;

    console.log('✅ Server is now ready');
  };

  const teardown = async () => {
    await WebSocketService.cleanup();

    await TasksManager.cleanup();

    await disconnectDatabase?.();
  };

  setup();

  nitroApp.hooks.hookOnce('close', teardown);
});
