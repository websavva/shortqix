import {
  defineEventHandler,
  getCookie,
  createError,
} from 'h3';
import jwt from 'jsonwebtoken';
import { db } from '../../db/database';
import { users } from '../../db/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth-token');

  if (!token) {
    return { user: null };
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.AUTH_SECRET!,
    ) as any;

    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, decoded.id))
      .limit(1);

    return { user: user[0] || null };
  } catch {
    return { user: null };
  }
});
