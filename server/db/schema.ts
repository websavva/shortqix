// Import and reexport all entities
export * from './entities';

// Reexport specific entities for backward compatibility
export {
  shortenedUrls,
  users,
  bitcoinAddresses,
  payments,
  magicLinks,
  paymentStatusEnum,
} from './entities';

// Reexport types for backward compatibility
export type {
  ShortenedUrl,
  NewShortenedUrl,
  User,
  NewUser,
  BitcoinAddress,
  NewBitcoinAddress,
  Payment,
  NewPayment,
  MagicLink,
  NewMagicLink,
} from './entities';
