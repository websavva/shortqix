import { z } from 'zod';

export const paymentId = () => z.uuid('Invalid payment ID');
