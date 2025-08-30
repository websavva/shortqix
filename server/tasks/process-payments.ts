import { db } from '../db/database';
import {
  payments as paymentsTable,
  bitcoinAddresses as bitcoinAddressesTable,
} from '../db/entities';
import { PaymentStatus } from '../db/entities/enums';
import { eq, and, sql, inArray } from 'drizzle-orm';

export async function processPayments() {
  const payments = await db
    .select()
    .from(paymentsTable)
    .where(
      and(
        inArray(paymentsTable.status, [
          PaymentStatus.PROCESSING,
          PaymentStatus.CONFIRMATION_PENDING,
        ]),
        sql`${paymentsTable.expiresAt} > ${new Date()}`,
      ),
    );
}
