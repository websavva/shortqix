import { initializeDatabase } from '../db';
import { smtpTransport } from '../services/smtp';

import { setupTasks } from '../tasks';

export default defineNitroPlugin(async (nitroApp) => {
  const disconnectDatabase = await initializeDatabase();
  
  await smtpTransport.verify();

  const stopTasks = await setupTasks();

  return async () => {
    await stopTasks();

    await disconnectDatabase();
  };
});
