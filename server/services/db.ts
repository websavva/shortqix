import { useLogger } from '#imports';

import { db, shortenedUrls } from '#server/db';

export class DatabaseService {
  static db = db;

  static logger = useLogger().withTag('database');

  static async setup() {
    try {
      // Test the connection
      await this.db.select().from(shortenedUrls).limit(1);
      this.logger.log('✅ Database connection established');
    } catch (error) {
      this.logger.error(
        '❌ Database connection failed:',
        error,
      );
      throw error;
    }
  }

  static async cleanup() {
    try {
      await this.db.$client.end();
      this.logger.log('🔌 Database connection closed');
    } catch (error) {
      this.logger.error(
        '❌ Error closing database connection:',
        error,
      );
    }
  }
}
