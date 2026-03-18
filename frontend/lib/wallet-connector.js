/**
 * Universal Wallet Connector for KodaPay
 * Modern ethers v6 + PAPI integration for professional-grade dApp
 * 
 * ARCHITECTURE:
 * - Ethers v6 for EVM transactions
 * - PAPI for Polkadot network interaction
 * - Universal window.ethereum support
 * - Multi-wallet compatibility (Talisman, SubWallet, etc.)
 */

import { ethers } from 'ethers'

/**
 * Universal Wallet Connector Class
 * Handles connection to multiple wallet types with modern stack
 */
export class WalletConnector {
  constructor() {
    this.provider = null
    this.signer = null
    this.account = null
    this.chainId = null
    this.isConnected = false
  }

  /**
   * Detect available wallet providers with Talisman prioritization
   * @returns {Object} Available wallet information
   */
  detectWallets() {
    const wallets = {
      talismanEth: typeof window !== 'undefined' && window.talismanEth,
      ethereum: typeof window !== 'undefined' && window.ethereum,
      talisman: typeof window !== 'undefined' && window.talisman,
      subwallet: typeof window !== 'undefined' && window.SubWallet,
      polkadotjs: typeof window !== 'undefined' && window.injectedWeb3?.['polkadot-js']
    }

    const available = Object.entries(wallets)
      .filter(([name, provider]) => provider)
      .map(([name, provider]) => ({
        name,
        provider,
        isMetaMask: provider?.isMetaMask,
        isTalisman: provider?.isTalisman || name === 'talismanEth',
        isSubWallet: provider?.isSubWallet,
        priority: name === 'talismanEth' ? 1 : name === 'talisman' ? 2 : name === 'ethereum' && provider?.isTalisman ? 3 : 4
      }))
      .sort((a, b) => a.priority - b.priority)

    console.log('🔍 Detected wallets (prioritized):', available.map(w => `${w.name} (${w.isTalisman ? 'Talisman' : w.isMetaMask ? 'MetaMask' : 'Other'})`))
    return available
  }

  /**
   * Get the best available Ethereum provider (prioritizes Talisman)
   * @returns {Object} Best provider information
   */
  getBestProvider() {
    // Priority order: window.talismanEth > window.ethereum (if Talisman) > window.ethereum (MetaMask)
    if (typeof window !== 'undefined') {
      // First priority: Talisman's dedicated Ethereum provider
      if (window.talismanEth) {
        console.log('🎯 Using Talisman Ethereum provider (window.talismanEth)')
        return {
          provider: window.talismanEth,
          name: 'Talisman (Ethereum)',
          isTalisman: true
        }
      }

      // Second priority: Check if window.ethereum is Talisman
      if (window.ethereum?.isTalisman) {
        console.log('🎯 Using Talisman via window.ethereum')
        return {
          provider: window.ethereum,
          name: 'Talisman',
          isTalisman: true
        }
      }

      // Third priority: MetaMask or other providers
      if (window.ethereum) {
        const providerName = window.ethereum.isMetaMask ? 'MetaMask' : 'Unknown Wallet'
        console.log(`🎯 Using ${providerName} via window.ethereum`)
        return {
          provider: window.ethereum,
          name: providerName,
          isMetaMask: window.ethereum.isMetaMask
        }
      }
    }

    return null
  }

  /**
   * Connect to wallet using window.ethereum (universal)
   * @param {string} rpcUrl - RPC endpoint for the network
   * @param {number} targetChainId - Target chain ID
   * @returns {Promise<Object>} Connection result
   */
  async connectUniversal(rpcUrl = 'http://127.0.0.1:8545', targetChainId = 31337) {
    try {
      // Get the best available provider (prioritizes Talisman)
      const bestProvider = this.getBestProvider()
      
      if (!bestProvider) {
        console.error('❌ No Ethereum wallet detected')
        throw new Error('No Ethereum wallet detected. Please install Talisman, SubWallet, or MetaMask.')
      }

      console.log(`🔍 Selected wallet: ${bestProvider.name}`)
      console.log('🔗 Connecting to wallet...')

      // Use the selected provider instead of window.ethereum
      const selectedProvider = bestProvider.provider

      // Request account access with detailed logging
      console.log('📋 Requesting accounts with eth_requestAccounts...')
      const accounts = await selectedProvider.request({
        method: 'eth_requestAccounts'
      })

      console.log('📋 Accounts received:', accounts)
      if (accounts.length === 0) {
        throw new Error('No accounts found. Please unlock your wallet.')
      }

      // Create ethers v6 provider from selected provider
      this.provider = new ethers.BrowserProvider(selectedProvider)
      this.signer = await this.provider.getSigner()
      this.account = accounts[0]

      // Store provider info for event listeners
      this.selectedProvider = selectedProvider
      this.providerInfo = bestProvider

      // Get current chain ID
      const network = await this.provider.getNetwork()
      this.chainId = Number(network.chainId)

      console.log('✅ Wallet connected:', {
        account: this.account,
        chainId: this.chainId,
        provider: bestProvider.name,
        isTalisman: bestProvider.isTalisman
      })

      // Check if we're on the correct network
      if (this.chainId !== targetChainId) {
        console.log(`⚠️ Wrong network detected!`)
        console.log(`   Current Chain ID: ${this.chainId}`)
        console.log(`   Required Chain ID: ${targetChainId} (GoChain - Local Hardhat)`)
        console.log(`🔄 Attempting automatic network switch...`)
        
        try {
          await this.switchNetwork(targetChainId, rpcUrl)
          console.log('✅ Network switched successfully!')
        } catch (switchError) {
          console.error('❌ Failed to switch network:', switchError)
          throw new Error(`Wrong network! Please switch to GoChain (Chain ID: ${targetChainId}) manually in your wallet.\n\nNetwork Name: GoChain\nRPC URL: http://127.0.0.1:8545\nChain ID: 31337\nCurrency Symbol: ETH`)
        }
      }

      this.isConnected = true

      // Listen for account changes on the selected provider
      selectedProvider.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          this.disconnect()
        } else {
          this.account = accounts[0]
          console.log('🔄 Account changed:', this.account)
        }
      })

      // Listen for chain changes on the selected provider
      selectedProvider.on('chainChanged', (chainId) => {
        this.chainId = parseInt(chainId, 16)
        console.log('🔄 Chain changed:', this.chainId)
        window.location.reload() // Reload to ensure clean state
      })

      return {
        success: true,
        account: this.account,
        chainId: this.chainId,
        provider: this.provider,
        signer: this.signer
      }

    } catch (error) {
      console.error('❌ Wallet connection failed:', error)
      throw error
    }
  }

  /**
   * Switch to target network
   * @param {number} chainId - Target chain ID
   * @param {string} rpcUrl - RPC URL for the network
   */
  async switchNetwork(chainId, rpcUrl) {
    const hexChainId = `0x${chainId.toString(16)}`
    console.log(`🔄 Switching to Chain ID: ${chainId} (${hexChainId})`)
    
    // Use the selected provider for network operations
    const provider = this.selectedProvider || window.ethereum
    
    try {
      // Try to switch to the network
      console.log('📡 Requesting network switch...')
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: hexChainId }]
      })
      console.log('✅ Network switch successful!')
      
    } catch (switchError) {
      console.log('⚠️ Switch failed, error code:', switchError.code)
      
      // If network doesn't exist, add it
      if (switchError.code === 4902) {
        console.log('🔧 Network not found, adding GoChain (Local Hardhat)...')
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: hexChainId,
              chainName: 'GoChain (Local Hardhat)',
              nativeCurrency: {
                name: 'Ethereum',
                symbol: 'ETH',
                decimals: 18
              },
              rpcUrls: [rpcUrl],
              blockExplorerUrls: []
            }]
          })
          console.log('✅ Network added successfully!')
          
          // After adding, try to switch again
          console.log('🔄 Switching to newly added network...')
          await provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: hexChainId }]
          })
          console.log('✅ Switch to new network successful!')
          
        } catch (addError) {
          console.error('❌ Failed to add network:', addError)
          throw new Error(`Failed to add GoChain to wallet. Please add it manually:\n\nNetwork Name: GoChain\nRPC URL: ${rpcUrl}\nChain ID: ${chainId}\nSymbol: ETH`)
        }
      } else if (switchError.code === 4001) {
        // User rejected the request
        console.log('👤 User rejected network switch')
        throw new Error('Network switch cancelled by user. Please switch to GoChain manually.')
      } else {
        console.error('❌ Unknown switch error:', switchError)
        throw new Error(`Failed to switch network: ${switchError.message || 'Unknown error'}`)
      }
    }
  }

  /**
   * Get wallet balance
   * @returns {Promise<string>} Balance in ETH format
   */
  async getBalance() {
    if (!this.provider || !this.account) {
      throw new Error('Wallet not connected')
    }

    const balance = await this.provider.getBalance(this.account)
    return ethers.formatEther(balance)
  }

  /**
   * Create contract instance
   * @param {string} address - Contract address
   * @param {Array} abi - Contract ABI
   * @returns {ethers.Contract} Contract instance
   */
  getContract(address, abi) {
    if (!this.signer) {
      throw new Error('Wallet not connected')
    }

    return new ethers.Contract(address, abi, this.signer)
  }

  /**
   * Disconnect wallet
   */
  disconnect() {
    // Remove event listeners from the selected provider
    if (this.selectedProvider) {
      this.selectedProvider.removeAllListeners('accountsChanged')
      this.selectedProvider.removeAllListeners('chainChanged')
    }

    this.provider = null
    this.signer = null
    this.account = null
    this.chainId = null
    this.isConnected = false
    this.selectedProvider = null
    this.providerInfo = null

    console.log('🔌 Wallet disconnected')
  }

  /**
   * Check if wallet is connected
   * @returns {boolean} Connection status
   */
  isWalletConnected() {
    return this.isConnected && this.account && this.provider
  }

  /**
   * Get connection info
   * @returns {Object} Current connection information
   */
  getConnectionInfo() {
    return {
      isConnected: this.isConnected,
      account: this.account,
      chainId: this.chainId,
      hasProvider: !!this.provider,
      hasSigner: !!this.signer
    }
  }
}

// Export singleton instance
export const walletConnector = new WalletConnector()

// Export utility functions
export const connectWallet = (rpcUrl, chainId) => walletConnector.connectUniversal(rpcUrl, chainId)
export const getWalletBalance = () => walletConnector.getBalance()
export const createContract = (address, abi) => walletConnector.getContract(address, abi)
export const disconnectWallet = () => walletConnector.disconnect()
export const isConnected = () => walletConnector.isWalletConnected()
