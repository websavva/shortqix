import * as bitcoin from 'bitcoinjs-lib';
import ECPairFactory from 'ecpair';
import * as ecc from 'tiny-secp256k1';
import { randomBytes } from 'node:crypto';

const ECPair = ECPairFactory(ecc);

function toHex(buffer: Uint8Array<ArrayBufferLike>) {
  return Buffer.from(buffer).toString('hex');
}

export function createBitcoinAddress() {
  const keyPair = ECPair.makeRandom({
    rng: () => randomBytes(32),
  });

  const { address } = bitcoin.payments.p2pkh({
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
