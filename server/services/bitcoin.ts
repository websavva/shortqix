import { randomBytes } from 'node:crypto';

import * as bitcoin from 'bitcoinjs-lib';
import ECPairFactory from 'ecpair';
import * as ecc from 'tiny-secp256k1';

const ECPair = ECPairFactory(ecc);

function toHex(buffer: Uint8Array<ArrayBufferLike>) {
  return Buffer.from(buffer).toString('hex');
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

export class BitcoinService {
  static readonly SATOSHIS_PER_BTC = 100_000_000;
  static readonly MEMPOOL_API_BASE = 'https://mempool.space/testnet/api';
  static readonly USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

  static createAddress() {
    const keyPair = ECPair.makeRandom({ rng: () => randomBytes(32) });

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

  static async convertUsdToBtc(amount: number) {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd',
    );

    if (!response.ok) {
      throw new Error('Failed to convert USD to BTC');
    }

    const data = (await response.json()) as { bitcoin: { usd: number } };

    return +((amount / data.bitcoin.usd).toFixed(8));
  }

  static calculateBalance(stats: BitcoinBalanceResponseStats): number {
    return this.normalizeAmount(
      (stats.funded_txo_sum - stats.spent_txo_sum) / this.SATOSHIS_PER_BTC,
    );
  }

  static async checkBalance(address: string) {
    const response = await fetch(
      `${this.MEMPOOL_API_BASE}/address/${address}`,
      {
        headers: { 'User-Agent': this.USER_AGENT },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to check balance: ${response.status}`);
    }

    const data = (await response.json()) as BitcoinBalanceResponse;

    return {
      pendingBalance: this.calculateBalance(data.mempool_stats),
      confirmedBalance: this.calculateBalance(data.chain_stats),
    };
  }

  static normalizeAmount(amount: number | string) {
    if (typeof amount === 'string') amount = Number(amount);
    return +(+amount).toFixed(8);
  }
}
