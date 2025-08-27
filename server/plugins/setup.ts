import { initializeDatabase } from '../db';
import { smtpTransport } from '../services/smtp';

export default defineNitroPlugin(async () => {
  await initializeDatabase();
  await smtpTransport.verify();
});
