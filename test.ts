import * as bitcoin from 'bitcoinjs-lib'
import ECPairFactory from 'ecpair'
import * as ecc from 'tiny-secp256k1'
import { randomBytes } from 'node:crypto'

const ECPair = ECPairFactory(ecc)

async function testBitcoinTestnetTransfer() {
  console.log('🚀 Testing Bitcoin Testnet Transfer...')
  
  // Create new Bitcoin testnet address
  const keyPair = ECPair.makeRandom({ rng: () => randomBytes(32) })
  const { address } = bitcoin.payments.p2pkh({ 
    pubkey: Buffer.from(keyPair.publicKey),
    network: bitcoin.networks.testnet 
  })
  
  if (!address) {
    throw new Error('Failed to generate Bitcoin testnet address')
  }
  
  console.log(`📝 Generated testnet address: ${address}`)
  console.log(`🔑 Private key: ${keyPair.privateKey ? Buffer.from(keyPair.privateKey).toString('hex') : 'undefined'}`)
  
  // Check initial balance using testnet mempool.space API
  const apiBase = 'https://mempool.space/testnet/api'
  
  try {
    const response = await fetch(`${apiBase}/address/${address}`)
    const data = await response.json()
    
    const initialBalance = (data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum) / 100000000
    console.log(`💰 Initial testnet balance: ${initialBalance} tBTC`)
    
    // Wait for user to send testnet Bitcoin
    console.log('\n📤 Please send some testnet Bitcoin to the address above...')
    console.log('💡 Get testnet coins from: https://testnet-faucet.mempool.co/')
    console.log('⏳ Waiting 30 seconds for transaction to be processed...')
    
    // Wait 30 seconds
    await new Promise(resolve => setTimeout(resolve, 30000))
    
    // Check balance again
    const finalResponse = await fetch(`${apiBase}/address/${address}`)
    const finalData = await finalResponse.json()
    
    const finalBalance = (finalData.chain_stats.funded_txo_sum - finalData.chain_stats.spent_txo_sum) / 100000000
    console.log(`💰 Final testnet balance: ${finalBalance} tBTC`)
    
    if (finalBalance > initialBalance) {
      console.log('✅ Testnet Bitcoin received! Transfer successful.')
    } else {
      console.log('❌ No testnet Bitcoin received yet. Transaction might still be pending.')
    }
    
  } catch (error) {
    console.error('❌ Error checking testnet balance:', error)
  }
}

testBitcoinTestnetTransfer()
