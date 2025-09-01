import * as bitcoin from 'bitcoinjs-lib';
import ECPairFactory from 'ecpair';
import * as ecc from 'tiny-secp256k1';
import { randomBytes } from 'node:crypto';

const ECPair = ECPairFactory(ecc);

function toHex(buffer: Uint8Array<ArrayBufferLike>) {
  return Buffer.from(buffer).toString('hex');
}

export function createBitcoinAddress() {
  const keyPair = ECPair.makeRandom();

  const { address } = bitcoin.payments.p2wpkh({
    pubkey: Buffer.from(keyPair.publicKey),
    network: bitcoin.networks.testnet,
  });

  return {
    address: address!,
    privateKey: toHex(keyPair.privateKey!),
    publicKey: toHex(keyPair.publicKey),
  };
}

export async function convertUsdToBtc(amount: number) {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd`,
  );

  if (!response.ok) {
    throw new Error('Failed to convert USD to BTC');
  }

  const data = (await response.json()) as {
    bitcoin: { usd: number };
  };

  return +(amount / data.bitcoin.usd).toFixed(8);
}

interface BitcoinBalanceResponseStats {
  funded_txo_count: number;
  funded_txo_sum: number;
  spent_txo_count: number;
  spent_txo_sum: number;
  tx_count: number;
}

export interface BitcoinBalanceResponse {
  address: string;
  chain_stats: BitcoinBalanceResponseStats;
  mempool_stats: BitcoinBalanceResponseStats;
}

export function calculateBitcoinBalance(
  stats: BitcoinBalanceResponseStats,
): number {
  return normalizeBitcoinAmount(
    (stats.funded_txo_sum - stats.spent_txo_sum) / 100e6,
  );
}

export async function checkBitcoinBalance(address: string) {
  const response = await fetch(
    `https://mempool.space/testnet/api/address/${address}`,
    {
      headers: {
        'User-Agent': 'ShortQix-Payment-Processor/1.0',
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to check balance: ${response.status}`,
    );
  }

  const data =
    (await response.json()) as BitcoinBalanceResponse;

  return {
    pendingBalance: calculateBitcoinBalance(
      data.mempool_stats,
    ),
    confirmedBalance: calculateBitcoinBalance(
      data.chain_stats,
    ),
  };
}

export function normalizeBitcoinAmount(
  amount: number | string,
) {
  if (typeof amount === 'string') {
    amount = Number(amount);
  }

  return +amount.toFixed(8);
}
