import {
  defineEventHandler,
  getRequestIP,
  createError,
  getRequestHeader,
} from 'h3';
import bowser from 'bowser';
import { useRuntimeConfig } from '#imports';

import { errorLogs } from '#server/db/entities/error-logs';
import { readValidatedBody } from '#server/utils/validation';
import { db } from '#server/db/database';

import { ErrorLogDtoSchema } from './imports/dto';

export default defineEventHandler(async (event) => {
  const { type, message, stack, url, env } =
    await readValidatedBody(ErrorLogDtoSchema, event);

  const config = useRuntimeConfig(event);

  if (!config.public.bugTracker.enabled) return;

  const userAgent =
    getRequestHeader(event, 'user-agent') || '';

  const userAgentInfo = JSON.stringify(
    bowser.parse(userAgent),
  );

  // Get user ID from current user
  const currentUser = event.context.currentUser;

  // Get IP address
  const ip =
    getRequestIP(event, { xForwardedFor: true }) || null;

  const ipInfo = await fetch(`https://ipinfo.io/${ip}`, {
    headers: {
      Accept: 'application/json',
    },
  }).then((res) => {
    if (!res.ok) {
      console.error(
        'Failed to fetch IP info:',
        res.statusText,
      );

      return null;
    }

    return res.text();
  });

  try {
    const [errorLog] = await db
      .insert(errorLogs)
      .values({
        type,
        message,
        stack,
        userId: currentUser?.id || null,
        userAgent,
        userAgentInfo,
        ip,
        ipInfo,
        url,
        env,
      })
      .returning();

    return { success: true, id: errorLog!.id };
  } catch (error) {
    console.error('Failed to store error log:', error);

    throw createError({
      statusCode: 500,
      message: 'Failed to track error',
    });
  }
});
