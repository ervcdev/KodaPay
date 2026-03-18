/**
 * KodaPay Frontend - Talisman Wallet Integration
 * 
 * ¿Qué hace este archivo?
 * Página principal de KodaPay optimizada para Talisman wallet y Westend Revive.
 * Reemplaza MetaMask con @polkadot/extension-dapp para mejor integración con Polkadot.
 * 
 * ¿Por qué Talisman en lugar de MetaMask?
 * - Talisman es nativo de Polkadot con soporte EVM integrado
 * - Mejor UX para usuarios del ecosistema Polkadot
 * - Soporte directo para Westend Revive sin configuración manual
 * - Gestión unificada de cuentas Substrate y EVM
 * 
 * ARQUITECTURA DE CONEXIÓN:
 * 1. Detecta extensiones Polkadot disponibles (Talisman, SubWallet, etc.)
 * 2. Conecta usando @polkadot/extension-dapp
 * 3. Obtiene cuentas EVM del usuario
 * 4. Inicializa provider para Westend Revive
 * 5. Configura contratos con ethers.js v6
 */

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import dynamic from 'next/dynamic'
import { walletConnector, connectWallet, createContract, getWalletBalance, disconnectWallet, isConnected } from '../lib/wallet-connector'
import WalletSelector from '../components/WalletSelector'

// Remove unused PAPI import that was causing issues

// Contract ABIs (simplified for demo)
const KodaPay_ABI = [
  "function deposit(uint256 amount) external",
  "function withdraw(uint256 amount) external", 
  "function createSubscription(address receiver, uint256 amount, uint256 frequency) external returns (uint256)",
  "function executePayment(uint256 subId) external",
  "function cancelSubscription(uint256 subId) external",
  "function userBalances(address user) external view returns (uint256)",
  "function isPaymentDue(uint256 subId) external view returns (bool)",
  "function getSubscription(uint256 subId) external view returns (address, address, uint256, uint256, uint256, bool)",
  "function getUserSubscriptions(address user) external view returns (uint256[])"
]

const USDT_ABI = [
  "function balanceOf(address owner) external view returns (uint256)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function faucet(address to, uint256 amount) external"
]

export default function Home() {
  // Hydration and mounting state
  const [isMounted, setIsMounted] = useState(false)
  const [walletReady, setWalletReady] = useState(false)
  
  // Wallet states (modernized)
  const [account, setAccount] = useState('')
  const [chainId, setChainId] = useState(null)
  const [balance, setBalance] = useState('0')
  const [KodaPayContract, setKodaPayContract] = useState(null)
  const [usdtContract, setUsdtContract] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showWalletSelector, setShowWalletSelector] = useState(false)
  
  // State for UI
  const [usdtBalance, setUsdtBalance] = useState('0')
  const [vaultBalance, setVaultBalance] = useState('0')
  const [subscriptions, setSubscriptions] = useState([])
  
  // Form states
  const [depositAmount, setDepositAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [newSubReceiver, setNewSubReceiver] = useState('')
  const [newSubAmount, setNewSubAmount] = useState('')
  const [newSubFrequency, setNewSubFrequency] = useState('')
  const [executeSubId, setExecuteSubId] = useState('')

  // Contract addresses (read from environment variables)
  const KodaPay_ADDRESS = process.env.NEXT_PUBLIC_KodaPay_ADDRESS
  const USDT_ADDRESS = process.env.NEXT_PUBLIC_USDT_ADDRESS
  
  // Testing configuration - easy to change for final video
  const FAUCET_AMOUNT = '10'    // Change to '1000' for final video
  const DEMO_MODE = true        // Set to false for production amounts
  
  console.log('🔧 Environment variables loaded:')
  console.log('  NEXT_PUBLIC_KodaPay_ADDRESS:', process.env.NEXT_PUBLIC_KodaPay_ADDRESS)
  console.log('  NEXT_PUBLIC_USDT_ADDRESS:', process.env.NEXT_PUBLIC_USDT_ADDRESS)
  console.log('🧪 Testing mode:', DEMO_MODE ? `${FAUCET_AMOUNT} mUSDT` : 'Production amounts')

  // Initialize client-side only functionality
  useEffect(() => {
    setIsMounted(true)
    
    // Initialize wallet connector
    const initWallet = async () => {
      try {
        // Check if already connected
        if (isConnected()) {
          const info = walletConnector.getConnectionInfo()
          setAccount(info.account)
          setChainId(info.chainId)
          setWalletReady(true)
          
          // Load balance and contracts
          await loadWalletData()
        }
        setWalletReady(true)
      } catch (error) {
        console.error('Failed to initialize wallet:', error)
        setWalletReady(true) // Still set ready to show connect button
      }
    }
    
    initWallet()
  }, [])

  useEffect(() => {
    if (account && isMounted && walletReady) {
      loadBalances()
      loadSubscriptions()
    }
  }, [account, isMounted, walletReady])

  const connectWalletModern = async () => {
    if (!isMounted || !walletReady) {
      console.warn('⚠️ Wallet system not ready:', { isMounted, walletReady })
      alert('Wallet system is still loading. Please try again in a moment.')
      return
    }

    console.log('🚀 Connect button clicked - starting wallet connection...')
    console.log('🔍 Environment check:', {
      windowExists: typeof window !== 'undefined',
      ethereumExists: typeof window !== 'undefined' && !!window.ethereum,
      walletReady,
      isMounted
    })

    setLoading(true)
    
    try {
      console.log('� Attempting wallet connection with best provider...')
      
      // Use universal wallet connector with Talisman prioritization
      const result = await connectWallet(
        'http://127.0.0.1:8545',  // Local Hardhat node
        31337 // GoChain (Local Hardhat) Chain ID
      )

      console.log('🔄 Connection result:', result)

      if (result.success) {
        setAccount(result.account)
        setChainId(result.chainId)
        
        // Load wallet data
        await loadWalletData()
        
        console.log('🎉 Wallet connected:', {
          account: result.account,
          chainId: result.chainId,
          network: 'Polkadot Hub TestNet',
          provider: walletConnector.providerInfo?.name || 'Unknown'
        })
      } else {
        console.error('❌ Connection failed - result.success is false')
      }
      
    } catch (error) {
      console.error('❌ Wallet connection failed:', error)
      
      // Provide helpful error messages
      if (error.message.includes('No Ethereum wallet detected')) {
        setShowWalletSelector(true) // Show selector to install wallets
      } else if (error.message.includes('User rejected')) {
        alert('Connection cancelled. Please try again and approve the connection.')
      } else {
        alert(`Connection failed: ${error.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleWalletSelect = async (selectedWallet) => {
    console.log('🎯 Wallet selected:', selectedWallet.name)
    setShowWalletSelector(false)
    
    // Store selected wallet info for connection
    walletConnector.selectedProvider = selectedWallet.provider
    walletConnector.providerInfo = selectedWallet
    
    await connectWithBestProvider()
  }

  const handleWalletSelectorCancel = () => {
    console.log('❌ Wallet selection cancelled')
    setShowWalletSelector(false)
  }

  const loadWalletData = async () => {
    try {
      console.log('💰 Loading wallet data...')
      
      // Get wallet balance
      const walletBalance = await getWalletBalance()
      setBalance(walletBalance)
      console.log('💰 Wallet balance loaded:', walletBalance)
      
      // Debug contract addresses
      console.log('🏠 Contract addresses check:')
      console.log('  KodaPay_ADDRESS:', KodaPay_ADDRESS)
      console.log('  USDT_ADDRESS:', USDT_ADDRESS)
      
      // Initialize contracts if addresses are available
      if (KodaPay_ADDRESS) {
        console.log('🏗️ Creating KodaPay contract with address:', KodaPay_ADDRESS)
        const KodaPay = createContract(KodaPay_ADDRESS, KodaPay_ABI)
        setKodaPayContract(KodaPay)
        console.log('✅ KodaPay contract created')
      } else {
        console.warn('⚠️ KodaPay contract address not configured')
      }
      
      if (USDT_ADDRESS) {
        console.log('🏗️ Creating USDT contract with address:', USDT_ADDRESS)
        const usdt = createContract(USDT_ADDRESS, USDT_ABI)
        setUsdtContract(usdt)
        console.log('✅ USDT contract created')
      } else {
        console.warn('⚠️ USDT contract address not configured')
      }
      
    } catch (error) {
      console.error('❌ Failed to load wallet data:', error)
      console.error('Error details:', error.message)
      console.error('Error stack:', error.stack)
    }
  }

  const disconnectWalletModern = () => {
    disconnectWallet()
    setAccount('')
    setChainId(null)
    setBalance('0')
    setKodaPayContract(null)
    setUsdtContract(null)
    setUsdtBalance('0')
    setVaultBalance('0')
    setSubscriptions([])
    console.log('🔌 Wallet disconnected')
  }

  const loadBalances = async () => {
    if (!usdtContract || !KodaPayContract || !account) return
    
    try {
      const usdtBal = await usdtContract.balanceOf(account)
      const vaultBal = await KodaPayContract.userBalances(account)
      
      setUsdtBalance(ethers.formatUnits(usdtBal, 6))
      setVaultBalance(ethers.formatUnits(vaultBal, 6))
    } catch (error) {
      console.error('Error loading balances:', error)
    }
  }

  const loadSubscriptions = async () => {
    if (!KodaPayContract || !account) return
    
    try {
      const subIds = await KodaPayContract.getUserSubscriptions(account)
      const subs = []
      
      for (let id of subIds) {
        const sub = await KodaPayContract.getSubscription(id)
        const isDue = await KodaPayContract.isPaymentDue(id)
        
        subs.push({
          id: id.toString(),
          owner: sub[0],
          receiver: sub[1],
          amount: ethers.formatUnits(sub[2], 6),
          frequency: sub[3].toString(),
          lastPayment: sub[4].toString(),
          active: sub[5],
          isDue
        })
      }
      
      setSubscriptions(subs)
    } catch (error) {
      console.error('Error loading subscriptions:', error)
    }
  }

  const handleDeposit = async () => {
    console.log('💳 Deposit button clicked!')
    console.log('🔍 Deposit validation:', {
      KodaPayContract: !!KodaPayContract,
      usdtContract: !!usdtContract,
      depositAmount: depositAmount,
      KodaPay_ADDRESS: KodaPay_ADDRESS
    })
    
    if (!KodaPayContract || !usdtContract || !depositAmount) {
      console.error('❌ Missing requirements for deposit')
      alert('Please ensure wallet is connected and amount is entered')
      return
    }
    
    setLoading(true)
    try {
      const amount = ethers.parseUnits(depositAmount, 6)
      console.log(`💰 Depositing ${depositAmount} mUSDT (${amount.toString()} units)`)
      
      // Step 1: Check current allowance
      console.log('🔍 Checking current allowance...')
      const currentAllowance = await usdtContract.allowance(account, KodaPay_ADDRESS)
      console.log('📊 Current allowance:', ethers.formatUnits(currentAllowance, 6), 'mUSDT')
      
      // Step 2: Approve if needed
      if (currentAllowance < amount) {
        console.log('📝 Approving USDT spending...')
        const approveTx = await usdtContract.approve(KodaPay_ADDRESS, amount)
        console.log('✅ Approve transaction sent:', approveTx.hash)
        
        console.log('⏳ Waiting for approve confirmation...')
        const approveReceipt = await approveTx.wait()
        console.log('✅ Approve confirmed:', approveReceipt.hash)
        
        // Verify allowance was set
        const newAllowance = await usdtContract.allowance(account, KodaPay_ADDRESS)
        console.log('📊 New allowance:', ethers.formatUnits(newAllowance, 6), 'mUSDT')
      } else {
        console.log('✅ Sufficient allowance already exists')
      }
      
      // Step 3: Execute deposit
      console.log('🏦 Executing deposit to vault...')
      const depositTx = await KodaPayContract.deposit(amount)
      console.log('✅ Deposit transaction sent:', depositTx.hash)
      
      console.log('⏳ Waiting for deposit confirmation...')
      const depositReceipt = await depositTx.wait()
      console.log('✅ Deposit confirmed:', depositReceipt.hash)
      
      // Step 4: Update UI
      setDepositAmount('')
      await loadBalances()
      alert(`Deposit successful! ${depositAmount} mUSDT added to your vault.`)
      console.log('🎉 Deposit completed successfully!')
      
    } catch (error) {
      console.error('❌ Deposit error:', error)
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
      console.error('Error code:', error.code)
      console.error('Error stack:', error.stack)
      
      // Provide specific error messages
      if (error.message.includes('insufficient allowance')) {
        alert('Deposit failed: Insufficient token allowance. Please try again.')
      } else if (error.message.includes('insufficient balance')) {
        alert('Deposit failed: Insufficient mUSDT balance. Use faucet first.')
      } else {
        alert('Deposit failed: ' + error.message)
      }
    }
    setLoading(false)
  }

  const handleWithdraw = async () => {
    if (!KodaPayContract || !withdrawAmount) return
    
    setLoading(true)
    try {
      const amount = ethers.parseUnits(withdrawAmount, 6)
      const tx = await KodaPayContract.withdraw(amount)
      await tx.wait()
      
      setWithdrawAmount('')
      await loadBalances()
      alert('Withdrawal successful!')
    } catch (error) {
      console.error('Withdrawal error:', error)
      alert('Withdrawal failed: ' + error.message)
    }
    setLoading(false)
  }

  const handleCreateSubscription = async () => {
    if (!KodaPayContract || !newSubReceiver || !newSubAmount || !newSubFrequency) return
    
    setLoading(true)
    try {
      const amount = ethers.parseUnits(newSubAmount, 6)
      const frequency = parseInt(newSubFrequency) * 86400 // Convert days to seconds
      
      const tx = await KodaPayContract.createSubscription(newSubReceiver, amount, frequency)
      await tx.wait()
      
      setNewSubReceiver('')
      setNewSubAmount('')
      setNewSubFrequency('')
      await loadSubscriptions()
      alert('Subscription created!')
    } catch (error) {
      console.error('Create subscription error:', error)
      alert('Failed to create subscription: ' + error.message)
    }
    setLoading(false)
  }

  const handleExecutePayment = async () => {
    if (!KodaPayContract || !executeSubId) return
    
    setLoading(true)
    try {
      const tx = await KodaPayContract.executePayment(executeSubId)
      await tx.wait()
      
      setExecuteSubId('')
      await loadSubscriptions()
      await loadBalances()
      alert('Payment executed! You earned the execution fee.')
    } catch (error) {
      console.error('Execute payment error:', error)
      alert('Failed to execute payment: ' + error.message)
    }
    setLoading(false)
  }

  const handleFaucet = async () => {
    console.log('🚰 Faucet button clicked!')
    console.log('🔍 Contract check:', {
      usdtContract: !!usdtContract,
      account: account,
      loading: loading
    })
    
    if (!usdtContract) {
      console.error('❌ USDT contract not available')
      alert('USDT contract not configured. Please check environment variables.')
      return
    }
    
    if (!account) {
      console.error('❌ No account connected')
      alert('Please connect your wallet first.')
      return
    }
    
    setLoading(true)
    try {
      console.log(`💰 Requesting ${FAUCET_AMOUNT} mUSDT from faucet...`)
      const amount = ethers.parseUnits(FAUCET_AMOUNT, 6)
      console.log('📊 Amount parsed:', amount.toString())
      
      console.log('📝 Calling faucet function...')
      const tx = await usdtContract.faucet(account, amount)
      console.log('✅ Transaction sent:', tx.hash)
      
      console.log('⏳ Waiting for confirmation...')
      const receipt = await tx.wait()
      console.log('✅ Transaction confirmed:', receipt.hash)
      
      await loadBalances()
      alert(`Faucet successful! You received ${FAUCET_AMOUNT} mUSDT`)
      console.log('🎉 Faucet completed successfully!')
    } catch (error) {
      console.error('❌ Faucet error:', error)
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
      console.error('Error code:', error.code)
      console.error('Error stack:', error.stack)
      alert('Faucet failed: ' + error.message)
    }
    setLoading(false)
  }

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>🚀 KodaPay - Decentralized Subscriptions</h1>
        <p>⏳ Loading Polkadot extensions...</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🚀 KodaPay - Decentralized Subscriptions</h1>
      
      {!account ? (
        <div>
          <button 
            onClick={connectWalletModern} 
            style={buttonStyle}
            disabled={!walletReady || loading}
          >
            {loading ? '⏳ Connecting...' : walletReady ? '🔗 Connect Wallet' : '⏳ Loading...'}
          </button>
          <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
            Supports: Talisman, SubWallet, MetaMask & more
          </p>
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div>
              <p><strong>Connected:</strong> {account}</p>
              <p><strong>Network:</strong> Polkadot Hub TestNet (Chain ID: {chainId})</p>
              <p><strong>Wallet Balance:</strong> {balance} PAS</p>
              <p><strong>USDT Balance:</strong> {usdtBalance} mUSDT</p>
              <p><strong>Vault Balance:</strong> {vaultBalance} mUSDT</p>
            </div>
            <button 
              onClick={disconnectWalletModern}
              style={{...buttonStyle, backgroundColor: '#dc3545'}}
            >
              🔌 Disconnect
            </button>
          </div>
          
          <hr />
          
          {/* Faucet */}
          <div style={sectionStyle}>
            <h3>💰 Get Test Tokens</h3>
            <button onClick={handleFaucet} disabled={loading} style={buttonStyle}>
              Get {FAUCET_AMOUNT} mUSDT (Faucet)
            </button>
          </div>
          
          {/* Deposit */}
          <div style={sectionStyle}>
            <h3>📥 Deposit to Vault</h3>
            <input
              type="number"
              placeholder={DEMO_MODE ? "Try 5 or 10 mUSDT" : "Amount"}
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              style={inputStyle}
            />
            <button onClick={handleDeposit} disabled={loading} style={buttonStyle}>
              Deposit {depositAmount ? `${depositAmount} mUSDT` : 'to Vault'}
            </button>
            {DEMO_MODE && (
              <div style={{fontSize: '12px', color: '#666', marginTop: '5px'}}>
                💡 Testing mode: Use small amounts like 5-10 mUSDT
              </div>
            )}
          </div>
          
          {/* Withdraw */}
          <div style={sectionStyle}>
            <h3>📤 Withdraw from Vault</h3>
            <input
              type="number"
              placeholder="Amount"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              style={inputStyle}
            />
            <button onClick={handleWithdraw} disabled={loading} style={buttonStyle}>
              Withdraw
            </button>
          </div>
          
          {/* Create Subscription */}
          <div style={sectionStyle}>
            <h3>➕ Create New Subscription</h3>
            <input
              type="text"
              placeholder="Receiver Address"
              value={newSubReceiver}
              onChange={(e) => setNewSubReceiver(e.target.value)}
              style={inputStyle}
            />
            <input
              type="number"
              placeholder="Amount (USDT)"
              value={newSubAmount}
              onChange={(e) => setNewSubAmount(e.target.value)}
              style={inputStyle}
            />
            <input
              type="number"
              placeholder="Frequency (days)"
              value={newSubFrequency}
              onChange={(e) => setNewSubFrequency(e.target.value)}
              style={inputStyle}
            />
            <button onClick={handleCreateSubscription} disabled={loading} style={buttonStyle}>
              Create Subscription
            </button>
          </div>
          
          {/* Execute Payment */}
          <div style={sectionStyle}>
            <h3>⚡ Execute Payment (Earn 1% Fee)</h3>
            <input
              type="number"
              placeholder="Subscription ID"
              value={executeSubId}
              onChange={(e) => setExecuteSubId(e.target.value)}
              style={inputStyle}
            />
            <button onClick={handleExecutePayment} disabled={loading} style={buttonStyle}>
              Execute Payment
            </button>
          </div>
          
          {/* Subscriptions List */}
          <div style={sectionStyle}>
            <h3>📋 Your Subscriptions</h3>
            {subscriptions.length === 0 ? (
              <p>No subscriptions found</p>
            ) : (
              subscriptions.map((sub) => (
                <div key={sub.id} style={subStyle}>
                  <p><strong>ID:</strong> {sub.id}</p>
                  <p><strong>Receiver:</strong> {sub.receiver}</p>
                  <p><strong>Amount:</strong> {sub.amount} mUSDT</p>
                  <p><strong>Frequency:</strong> {Math.floor(sub.frequency / 86400)} days</p>
                  <p><strong>Status:</strong> {sub.active ? 'Active' : 'Inactive'}</p>
                  <p><strong>Payment Due:</strong> {sub.isDue ? '✅ Yes' : '❌ No'}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      
      {loading && <p>⏳ Processing transaction...</p>}
      
      {/* Wallet Selector Modal */}
      {showWalletSelector && (
        <WalletSelector
          onWalletSelect={handleWalletSelect}
          onCancel={handleWalletSelectorCancel}
        />
      )}
    </div>
  )
}

const buttonStyle = {
  padding: '10px 20px',
  margin: '5px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer'
}

const inputStyle = {
  padding: '8px',
  margin: '5px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  width: '200px'
}

const sectionStyle = {
  margin: '20px 0',
  padding: '15px',
  border: '1px solid #ddd',
  borderRadius: '8px'
}

const subStyle = {
  padding: '10px',
  margin: '10px 0',
  backgroundColor: '#f8f9fa',
  border: '1px solid #dee2e6',
  borderRadius: '5px'
}
