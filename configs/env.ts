export const PRIVATE_ENV_NAMES = [
  'SQX_POSTGRES_USER',
  'SQX_POSTGRES_PASSWORD',
  'SQX_POSTGRES_DB',
  'SQX_POSTGRES_PORT',
  'SQX_POSTGRES_HOST',
  'SQX_AUTH_SECRET',
  'SQX_SMTP_HOST',
  'SQX_SMTP_PORT',
  'SQX_SMTP_USER',
  'SQX_SMTP_PASSWORD',
  'SQX_AUTH_TOKEN_EXPIRES_IN_MS',
  'SQX_AUTH_MAGIC_LINK_TOKEN_EXPIRES_IN_MS',
  'SQX_PAYMENT_EXPIRES_IN_MS',
  'SQX_SESSION_ID_COOKIE_EXPIRES_IN_MS',
  'SQX_NON_PREMIUM_SHORT_URLS_MAX_COUNT',
  'SQX_PREMIUM_SHORT_URLS_MAX_COUNT',
  'SQX_COOKIE_DOMAIN',
];

export const PUBLIC_ENV_NAMES = [
  'SQX_BASE_URL',
  'SQX_APP_NAME',
  'SQX_SUPPORT_EMAIL',
  'SQX_DOMAIN',
  'SQX_STAGE',
  'SQX_YM_ID',
];

export const formatDefine = (envNames: string[]) => {
  return Object.fromEntries(
    envNames
      .map((name) => [
        `process.env.${name}`,
        JSON.stringify(process.env[name]),
      ])
      .filter(([_, value]) => typeof value !== 'undefined'),
  );
};

export const publicDefine = formatDefine(PUBLIC_ENV_NAMES);

export const privateDefine = formatDefine(
  PRIVATE_ENV_NAMES,
);
