import { db } from '../db';
import { shortenedUrls } from '../db/schema';

export class DatabaseService {
  static db = db;

  static async setup() {
    try {
      // Test the connection
      await this.db.select().from(shortenedUrls).limit(1);
      console.log('✅ Database connection established');
    } catch (error) {
      console.error(
        '❌ Database connection failed:',
        error,
      );
      throw error;
    }
  }

  static async cleanup() {
    try {
      await this.db.$client.end();
      console.log('🔌 Database connection closed');
    } catch (error) {
      console.error(
        '❌ Error closing database connection:',
        error,
      );
    }
  }
}
