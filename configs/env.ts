export const PRIVATE_ENV_NAMES = [
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'POSTGRES_DB',
  'POSTGRES_PORT',
  'POSTGRES_HOST',
  'AUTH_SECRET',
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASSWORD',
  'SMTP_FROM',
  'AUTH_TOKEN_EXPIRES_IN_MS',
  'AUTH_MAGIC_LINK_TOKEN_EXPIRES_IN_MS',
  'PAYMENT_EXPIRES_IN_MS',
  'SESSION_ID_COOKIE_EXPIRES_IN_MS',
  'NON_PREMIUM_SHORT_URLS_MAX_COUNT',
  'PREMIUM_SHORT_URLS_MAX_COUNT',
];

export const PUBLIC_ENV_NAMES = [
  'BASE_URL',
  'APP_NAME',
  'SUPPORT_EMAIL',
  'DOMAIN',
];

export const formatDefine = (envNames: string[]) => {
  return Object.fromEntries(
    envNames.map((name) => [
      `process.env.${name}`,
      JSON.stringify(process.env[name]),
    ]),
  );
};

export const publicDefine = formatDefine(PUBLIC_ENV_NAMES);

export const privateDefine = formatDefine(
  PRIVATE_ENV_NAMES,
);
