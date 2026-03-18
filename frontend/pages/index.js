/**
 * SubScript Frontend - Professional Web3 Dashboard
 * 
 * A decentralized autonomous subscription protocol built for Polkadot.
 * Clean, minimalist UI with Polkadot-inspired dark theme.
 * 
 * ARCHITECTURE:
 * - Modular components for maintainability
 * - Talisman/MetaMask wallet integration
 * - Ethers.js v6 for contract interactions
 */

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { walletConnector, connectWallet, createContract, getWalletBalance, disconnectWallet, isConnected } from '../lib/wallet-connector'
import Header from '../components/Header'
import VaultCard from '../components/VaultCard'
import SubscriptionForm from '../components/SubscriptionForm'
import SubscriptionsTable from '../components/SubscriptionsTable'
import ActivityLog from '../components/ActivityLog'
import WalletSelector from '../components/WalletSelector'

// Contract ABIs
const SubScript_ABI = [
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
  // Mounting state
  const [isMounted, setIsMounted] = useState(false)
  const [walletReady, setWalletReady] = useState(false)
  
  // Wallet states
  const [account, setAccount] = useState('')
  const [chainId, setChainId] = useState(null)
  const [balance, setBalance] = useState('0')
  const [subScriptContract, setSubScriptContract] = useState(null)
  const [usdtContract, setUsdtContract] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showWalletSelector, setShowWalletSelector] = useState(false)
  
  // UI state
  const [usdtBalance, setUsdtBalance] = useState('0')
  const [vaultBalance, setVaultBalance] = useState('0')
  const [subscriptions, setSubscriptions] = useState([])
  const [activities, setActivities] = useState([])
  
  // Form states
  const [depositAmount, setDepositAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [newSubReceiver, setNewSubReceiver] = useState('')
  const [newSubAmount, setNewSubAmount] = useState('')
  const [newSubFrequency, setNewSubFrequency] = useState('')

  // Contract addresses
  const SUBSCRIPT_ADDRESS = process.env.NEXT_PUBLIC_KodaPay_ADDRESS || process.env.NEXT_PUBLIC_SUBSCRIPT_ADDRESS
  const USDT_ADDRESS = process.env.NEXT_PUBLIC_USDT_ADDRESS
  
  // Testing configuration
  const FAUCET_AMOUNT = '10'

  // Initialize client-side
  useEffect(() => {
    setIsMounted(true)
    
    const initWallet = async () => {
      try {
        if (isConnected()) {
          const info = walletConnector.getConnectionInfo()
          setAccount(info.account)
          setChainId(info.chainId)
          setWalletReady(true)
          await loadWalletData()
        }
        setWalletReady(true)
      } catch (error) {
        console.error('Failed to initialize wallet:', error)
        setWalletReady(true)
      }
    }
    
    initWallet()
  }, [])

  useEffect(() => {
    if (account && isMounted && walletReady) {
      loadBalances()
      loadSubscriptions()
    }
  }, [account, isMounted, walletReady, subScriptContract, usdtContract])

  const handleConnectWallet = async () => {
    if (!isMounted || !walletReady) {
      return
    }

    setLoading(true)
    
    try {
      const result = await connectWallet('http://127.0.0.1:8545', 31337)

      if (result.success) {
        setAccount(result.account)
        setChainId(result.chainId)
        await loadWalletData()
      }
    } catch (error) {
      console.error('Wallet connection failed:', error)
      if (error.message.includes('No Ethereum wallet detected')) {
        setShowWalletSelector(true)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleWalletSelect = async (selectedWallet) => {
    setShowWalletSelector(false)
    walletConnector.selectedProvider = selectedWallet.provider
    walletConnector.providerInfo = selectedWallet
    await handleConnectWallet()
  }

  const loadWalletData = async () => {
    try {
      const walletBalance = await getWalletBalance()
      setBalance(walletBalance)
      
      if (SUBSCRIPT_ADDRESS) {
        const subScript = createContract(SUBSCRIPT_ADDRESS, SubScript_ABI)
        setSubScriptContract(subScript)
      }
      
      if (USDT_ADDRESS) {
        const usdt = createContract(USDT_ADDRESS, USDT_ABI)
        setUsdtContract(usdt)
      }
    } catch (error) {
      console.error('Failed to load wallet data:', error)
    }
  }

  const handleDisconnectWallet = () => {
    disconnectWallet()
    setAccount('')
    setChainId(null)
    setBalance('0')
    setSubScriptContract(null)
    setUsdtContract(null)
    setUsdtBalance('0')
    setVaultBalance('0')
    setSubscriptions([])
  }

  const loadBalances = async () => {
    if (!usdtContract || !subScriptContract || !account) return
    
    try {
      const usdtBal = await usdtContract.balanceOf(account)
      const vaultBal = await subScriptContract.userBalances(account)
      
      setUsdtBalance(ethers.formatUnits(usdtBal, 6))
      setVaultBalance(ethers.formatUnits(vaultBal, 6))
    } catch (error) {
      console.error('Error loading balances:', error)
    }
  }

  const loadSubscriptions = async () => {
    if (!subScriptContract || !account) return
    
    try {
      const subIds = await subScriptContract.getUserSubscriptions(account)
      const subs = []
      
      for (let id of subIds) {
        const sub = await subScriptContract.getSubscription(id)
        const isDue = await subScriptContract.isPaymentDue(id)
        
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

  // Handler functions for contract interactions
  const handleDeposit = async () => {
    if (!subScriptContract || !usdtContract || !depositAmount) return
    
    setLoading(true)
    try {
      const amount = ethers.parseUnits(depositAmount, 6)
      
      const currentAllowance = await usdtContract.allowance(account, SUBSCRIPT_ADDRESS)
      
      if (currentAllowance < amount) {
        const approveTx = await usdtContract.approve(SUBSCRIPT_ADDRESS, amount)
        await approveTx.wait()
      }
      
      const depositTx = await subScriptContract.deposit(amount)
      await depositTx.wait()
      
      setDepositAmount('')
      await loadBalances()
      
      addActivity('deposit', depositAmount)
    } catch (error) {
      console.error('Deposit error:', error)
    }
    setLoading(false)
  }

  const handleWithdraw = async () => {
    if (!subScriptContract || !withdrawAmount) return
    
    setLoading(true)
    try {
      const amount = ethers.parseUnits(withdrawAmount, 6)
      const tx = await subScriptContract.withdraw(amount)
      await tx.wait()
      
      setWithdrawAmount('')
      await loadBalances()
      
      addActivity('withdraw', withdrawAmount)
    } catch (error) {
      console.error('Withdrawal error:', error)
    }
    setLoading(false)
  }

  const handleCreateSubscription = async () => {
    if (!subScriptContract || !newSubReceiver || !newSubAmount || !newSubFrequency) return
    
    setLoading(true)
    try {
      const amount = ethers.parseUnits(newSubAmount, 6)
      const frequency = parseInt(newSubFrequency) * 86400
      
      const tx = await subScriptContract.createSubscription(newSubReceiver, amount, frequency)
      await tx.wait()
      
      setNewSubReceiver('')
      setNewSubAmount('')
      setNewSubFrequency('')
      await loadSubscriptions()
    } catch (error) {
      console.error('Create subscription error:', error)
    }
    setLoading(false)
  }

  const handleCancelSubscription = async (subId) => {
    if (!subScriptContract) return
    
    setLoading(true)
    try {
      const tx = await subScriptContract.cancelSubscription(subId)
      await tx.wait()
      await loadSubscriptions()
      
      addActivity('cancel', null, subId)
    } catch (error) {
      console.error('Cancel subscription error:', error)
    }
    setLoading(false)
  }

  const handleExecutePayment = async (subId) => {
    if (!subScriptContract) return
    
    setLoading(true)
    try {
      const tx = await subScriptContract.executePayment(subId)
      await tx.wait()
      await loadSubscriptions()
      await loadBalances()
    } catch (error) {
      console.error('Execute payment error:', error)
    }
    setLoading(false)
  }

  const handleFaucet = async () => {
    if (!usdtContract || !account) return
    
    setLoading(true)
    try {
      const amount = ethers.parseUnits(FAUCET_AMOUNT, 6)
      const tx = await usdtContract.faucet(account, amount)
      await tx.wait()
      await loadBalances()
      
      addActivity('deposit', FAUCET_AMOUNT)
    } catch (error) {
      console.error('Faucet error:', error)
    }
    setLoading(false)
  }

  const addActivity = (type, amount, subscriptionId = null) => {
    const newActivity = {
      id: Date.now(),
      type,
      amount,
      subscriptionId,
      timestamp: Date.now(),
      status: 'success'
    }
    setActivities(prev => [newActivity, ...prev].slice(0, 10))
  }

  // Loading state
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading SubScript...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        account={account}
        chainId={chainId}
        loading={loading}
        walletReady={walletReady}
        onConnect={handleConnectWallet}
        onDisconnect={handleDisconnectWallet}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!account ? (
          // Welcome State
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <span className="text-4xl font-bold text-primary">S</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Welcome to SubScript
            </h1>
            <p className="text-lg text-text-secondary max-w-md mb-8">
              The decentralized autonomous subscription protocol. 
              Manage recurring payments on-chain with complete transparency.
            </p>
            <button
              onClick={handleConnectWallet}
              disabled={!walletReady || loading}
              className="btn-primary text-lg px-8 py-3"
            >
              {loading ? 'Connecting...' : 'Connect Your Wallet'}
            </button>
            <p className="text-sm text-text-muted mt-4">
              Supports Talisman, SubWallet, MetaMask & more
            </p>
          </div>
        ) : (
          // Dashboard
          <div className="space-y-6">
            {/* Top Row: Vault Card */}
            <VaultCard
              vaultBalance={vaultBalance}
              usdtBalance={usdtBalance}
              walletBalance={balance}
              depositAmount={depositAmount}
              setDepositAmount={setDepositAmount}
              withdrawAmount={withdrawAmount}
              setWithdrawAmount={setWithdrawAmount}
              onDeposit={handleDeposit}
              onWithdraw={handleWithdraw}
              onFaucet={handleFaucet}
              loading={loading}
              faucetAmount={FAUCET_AMOUNT}
            />

            {/* Middle Row: Create Subscription & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SubscriptionForm
                receiver={newSubReceiver}
                setReceiver={setNewSubReceiver}
                amount={newSubAmount}
                setAmount={setNewSubAmount}
                frequency={newSubFrequency}
                setFrequency={setNewSubFrequency}
                onCreateSubscription={handleCreateSubscription}
                loading={loading}
              />
              <ActivityLog activities={activities} />
            </div>

            {/* Bottom Row: Subscriptions Table */}
            <SubscriptionsTable
              subscriptions={subscriptions}
              onCancel={handleCancelSubscription}
              onExecute={handleExecutePayment}
              loading={loading}
            />
          </div>
        )}
      </main>

      {/* Wallet Selector Modal */}
      {showWalletSelector && (
        <WalletSelector
          onWalletSelect={handleWalletSelect}
          onCancel={() => setShowWalletSelector(false)}
        />
      )}
    </div>
  )
}
