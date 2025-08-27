import { createHash, randomBytes } from 'node:crypto'

import * as bitcoin from 'bitcoinjs-lib'
import ECPairFactory from 'ecpair';
import * as ecc from 'tiny-secp256k1';

const ECPair = ECPairFactory(ecc);

const rng = (size: number) => randomBytes(size)

export class BitcoinAddressGenerator {
  private masterSeed: Buffer

  constructor(masterSeedHex?: string) {
    // Use provided seed or generate from environment variable
    if (masterSeedHex) {
      this.masterSeed = Buffer.from(masterSeedHex, 'hex')
    } else {
      // Generate from environment variable or create new one
      const envSeed = process.env.BITCOIN_MASTER_SEED
      if (envSeed) {
        this.masterSeed = Buffer.from(envSeed, 'hex')
      } else {
        // Generate a new master seed (store this securely!)
        this.masterSeed = randomBytes(32)
        console.warn('Generated new Bitcoin master seed. Store BITCOIN_MASTER_SEED in environment variables!')
      }
    }
  }

  // Generate a new Bitcoin address for a given index
  generateAddress(index: number): string {
    // Create a deterministic seed for this index
    const indexBuffer = Buffer.alloc(4)
    indexBuffer.writeUInt32BE(index, 0)
    
    const combined = Buffer.concat([this.masterSeed, indexBuffer])
    const hash = createHash('sha256').update(combined).digest()
    
    // Create a P2PKH address (Legacy)
    const keyPair = ECPair.makeRandom({ rng });

    keyPair.
    const { address } = bitcoin.payments.p2pkh({ 
      pubkey: keyPair.publicKey,
      network: bitcoin.networks.bitcoin 
    })
    
    if (!address) {
      throw new Error('Failed to generate Bitcoin address')
    }
    
    return address
  }

  // Get the next available index (you might want to track this in your database)
  async getNextIndex(): Promise<number> {
    // For simplicity, we'll use timestamp-based index
    // In production, you should track this in your database
    return Math.floor(Date.now() / 1000)
  }
}

// Balance checking utility
export class BitcoinBalanceChecker {
  private apiBase = 'https://mempool.space/api'

  async checkAddressBalance(address: string): Promise<{
    balance: number
    confirmed: number
    unconfirmed: number
  }> {
    try {
      const response = await fetch(`${this.apiBase}/address/${address}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch balance: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      return {
        balance: (data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum) / 100000000, // Convert from satoshis
        confirmed: (data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum) / 100000000,
        unconfirmed: (data.mempool_stats.funded_txo_sum - data.mempool_stats.spent_txo_sum) / 100000000
      }
    } catch (error) {
      console.error('Error checking Bitcoin balance:', error)
      throw error
    }
  }

  async checkAddressTransactions(address: string): Promise<Array<{
    txid: string
    value: number
    status: 'confirmed' | 'unconfirmed'
    blockTime?: number
  }>> {
    try {
      const response = await fetch(`${this.apiBase}/address/${address}/txs`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch transactions: ${response.statusText}`)
      }
      
      const transactions = await response.json()
      
      return transactions.map((tx: any) => ({
        txid: tx.txid,
        value: tx.value / 100000000, // Convert from satoshis
        status: tx.status.block_time ? 'confirmed' : 'unconfirmed',
        blockTime: tx.status.block_time
      }))
    } catch (error) {
      console.error('Error checking Bitcoin transactions:', error)
      throw error
    }
  }
}

// Export singleton instances
export const bitcoinAddressGenerator = new BitcoinAddressGenerator()
export const bitcoinBalanceChecker = new BitcoinBalanceChecker() 