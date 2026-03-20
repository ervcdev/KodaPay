/**
 * KodaPay - Web3 Subscription Protocol on Polkadot
 * Ultra-minimalist SaaS Premium UI
 */

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { walletConnector, connectWallet, createContract, getWalletBalance, disconnectWallet, isConnected } from '../lib/wallet-connector'
import Header from '../components/Header'
import HeroStats from '../components/HeroStats'
import FaucetBox from '../components/FaucetBox'
import ManageFunds from '../components/ManageFunds'
import CreateSubscription from '../components/CreateSubscription'
import PaymentExecutor from '../components/PaymentExecutor'
import SubscriptionsTable from '../components/SubscriptionsTable'
import Footer from '../components/Footer'
import WalletSelector from '../components/WalletSelector'

// Contract ABIs
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

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column',
  },
  main: {
    flex: 1,
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto',
    padding: '32px 48px',
  },
  welcome: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '70vh',
    textAlign: 'center',
  },
  welcomeTitle: {
    fontSize: '48px',
    fontWeight: 700,
    color: '#121212',
    letterSpacing: '-1px',
    marginBottom: '16px',
  },
  welcomeTitlePink: {
    color: '#E6007A',
  },
  welcomeText: {
    fontSize: '18px',
    color: '#525252',
    maxWidth: '500px',
    marginBottom: '40px',
    lineHeight: 1.7,
  },
  welcomeBtn: {
    padding: '16px 40px',
    backgroundColor: '#121212',
    color: '#FFFFFF',
    border: 'none',
    fontSize: '16px',
    fontWeight: 500,
    cursor: 'pointer',
  },
  welcomeHint: {
    fontSize: '13px',
    color: '#A3A3A3',
    marginTop: '20px',
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    marginBottom: '24px',
  },
  section: {
    marginBottom: '24px',
  },
  loader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#FFFFFF',
  },
  spinner: {
    width: '32px',
    height: '32px',
    border: '3px solid #E5E5E5',
    borderTopColor: '#E6007A',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '16px',
  },
  loaderText: {
    color: '#737373',
    fontSize: '14px',
  },
}

export default function Home() {
  // Mounting state
  const [isMounted, setIsMounted] = useState(false)
  const [walletReady, setWalletReady] = useState(false)
  
  // Wallet states
  const [account, setAccount] = useState('')
  const [chainId, setChainId] = useState(null)
  const [balance, setBalance] = useState('0')
  const [kodaPayContract, setKodaPayContract] = useState(null)
  const [usdtContract, setUsdtContract] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showWalletSelector, setShowWalletSelector] = useState(false)
  
  // UI state
  const [usdtBalance, setUsdtBalance] = useState('0')
  const [vaultBalance, setVaultBalance] = useState('0')
  const [subscriptions, setSubscriptions] = useState([])
  
  // Form states
  const [newSubReceiver, setNewSubReceiver] = useState('')
  const [newSubAmount, setNewSubAmount] = useState('')
  const [newSubFrequency, setNewSubFrequency] = useState('')

  // Contract addresses
  const KODAPAY_ADDRESS = process.env.NEXT_PUBLIC_KodaPay_ADDRESS || process.env.NEXT_PUBLIC_SUBSCRIPT_ADDRESS
  const USDT_ADDRESS = process.env.NEXT_PUBLIC_USDT_ADDRESS
  
  // Testing configuration
  const FAUCET_AMOUNT = '100'

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
  }, [account, isMounted, walletReady, kodaPayContract, usdtContract])

  const handleConnectWallet = async () => {
    if (!isMounted || !walletReady) return

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
      
      if (KODAPAY_ADDRESS) {
        const kodaPay = createContract(KODAPAY_ADDRESS, KodaPay_ABI)
        setKodaPayContract(kodaPay)
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
    setKodaPayContract(null)
    setUsdtContract(null)
    setUsdtBalance('0')
    setVaultBalance('0')
    setSubscriptions([])
  }

  const loadBalances = async () => {
    if (!usdtContract || !kodaPayContract || !account) return
    
    try {
      const usdtBal = await usdtContract.balanceOf(account)
      const vaultBal = await kodaPayContract.userBalances(account)
      
      setUsdtBalance(ethers.formatUnits(usdtBal, 6))
      setVaultBalance(ethers.formatUnits(vaultBal, 6))
    } catch (error) {
      console.error('Error loading balances:', error)
    }
  }

  const loadSubscriptions = async () => {
    if (!kodaPayContract || !account) return
    
    try {
      const subIds = await kodaPayContract.getUserSubscriptions(account)
      const subs = []
      
      for (let id of subIds) {
        const sub = await kodaPayContract.getSubscription(id)
        const isDue = await kodaPayContract.isPaymentDue(id)
        
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

  // Handler functions
  const handleDeposit = async (amount) => {
    if (!kodaPayContract || !usdtContract || !amount) return
    
    setLoading(true)
    try {
      const parsedAmount = ethers.parseUnits(amount, 6)
      
      const currentAllowance = await usdtContract.allowance(account, KODAPAY_ADDRESS)
      
      if (currentAllowance < parsedAmount) {
        const approveTx = await usdtContract.approve(KODAPAY_ADDRESS, parsedAmount)
        await approveTx.wait()
      }
      
      const depositTx = await kodaPayContract.deposit(parsedAmount)
      await depositTx.wait()
      
      await loadBalances()
    } catch (error) {
      console.error('Deposit error:', error)
    }
    setLoading(false)
  }

  const handleWithdraw = async (amount) => {
    if (!kodaPayContract || !amount) return
    
    setLoading(true)
    try {
      const parsedAmount = ethers.parseUnits(amount, 6)
      const tx = await kodaPayContract.withdraw(parsedAmount)
      await tx.wait()
      
      await loadBalances()
    } catch (error) {
      console.error('Withdrawal error:', error)
    }
    setLoading(false)
  }

  const handleCreateSubscription = async () => {
    if (!kodaPayContract || !newSubReceiver || !newSubAmount || !newSubFrequency) return
    
    setLoading(true)
    try {
      const amount = ethers.parseUnits(newSubAmount, 6)
      const frequency = parseInt(newSubFrequency) * 86400
      
      const tx = await kodaPayContract.createSubscription(newSubReceiver, amount, frequency)
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
    if (!kodaPayContract) return
    
    setLoading(true)
    try {
      const tx = await kodaPayContract.cancelSubscription(subId)
      await tx.wait()
      await loadSubscriptions()
    } catch (error) {
      console.error('Cancel subscription error:', error)
    }
    setLoading(false)
  }

  const handleExecutePayment = async (subId) => {
    if (!kodaPayContract) return
    
    setLoading(true)
    try {
      const tx = await kodaPayContract.executePayment(subId)
      await tx.wait()
      await loadSubscriptions()
      await loadBalances()
    } catch (error) {
      console.error('Execute payment error:', error)
    }
    setLoading(false)
  }

  const handleRunAllDue = async () => {
    const dueSubs = subscriptions.filter(s => s.active && s.isDue)
    for (const sub of dueSubs) {
      await handleExecutePayment(sub.id)
    }
  }

  const handleFaucet = async () => {
    if (!usdtContract || !account) return
    
    setLoading(true)
    try {
      const amount = ethers.parseUnits(FAUCET_AMOUNT, 6)
      const tx = await usdtContract.faucet(account, amount)
      await tx.wait()
      await loadBalances()
    } catch (error) {
      console.error('Faucet error:', error)
    }
    setLoading(false)
  }

  // Computed values
  const dueSubscriptions = subscriptions.filter(s => s.active && s.isDue)
  const totalPending = dueSubscriptions.reduce((acc, s) => acc + parseFloat(s.amount), 0).toFixed(2)
  const activeSubscriptions = subscriptions.filter(s => s.active).length

  // Loading state
  if (!isMounted) {
    return (
      <div style={styles.loader}>
        <div style={styles.spinner}></div>
        <p style={styles.loaderText}>Loading KodaPay...</p>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <Header
        account={account}
        chainId={chainId}
        loading={loading}
        walletReady={walletReady}
        wndBalance={balance}
        usdtBalance={usdtBalance}
        onConnect={handleConnectWallet}
        onDisconnect={handleDisconnectWallet}
      />

      <main style={styles.main}>
        {!account ? (
          <div style={styles.welcome}>
            <h1 style={styles.welcomeTitle}>
              Koda<span style={styles.welcomeTitlePink}>Pay</span>
            </h1>
            <p style={styles.welcomeText}>
              The decentralized subscription protocol built on Polkadot. 
              Manage recurring payments on-chain with complete transparency.
            </p>
            <button
              onClick={handleConnectWallet}
              disabled={!walletReady || loading}
              style={{
                ...styles.welcomeBtn,
                opacity: (!walletReady || loading) ? 0.6 : 1,
                cursor: (!walletReady || loading) ? 'not-allowed' : 'pointer',
              }}
              onMouseOver={(e) => {
                if (walletReady && !loading) e.target.style.backgroundColor = '#2a2a2a'
              }}
              onMouseOut={(e) => {
                if (walletReady && !loading) e.target.style.backgroundColor = '#121212'
              }}
            >
              {loading ? 'Connecting...' : 'Connect Wallet'}
            </button>
            <p style={styles.welcomeHint}>
              Supports Talisman, SubWallet, MetaMask
            </p>
          </div>
        ) : (
          <>
            {/* Hero Stats */}
            <div style={styles.section}>
              <HeroStats
                vaultBalance={vaultBalance}
                totalSubscriptions={subscriptions.length}
                activeSubscriptions={activeSubscriptions}
              />
            </div>

            {/* Faucet */}
            <div style={styles.section}>
              <FaucetBox onMint={handleFaucet} isLoading={loading} />
            </div>

            {/* Main Actions Grid */}
            <div style={styles.grid2}>
              <ManageFunds
                onDeposit={handleDeposit}
                onWithdraw={handleWithdraw}
                isLoading={loading}
              />
              <CreateSubscription
                receiver={newSubReceiver}
                setReceiver={setNewSubReceiver}
                amount={newSubAmount}
                setAmount={setNewSubAmount}
                frequency={newSubFrequency}
                setFrequency={setNewSubFrequency}
                onCreateSubscription={handleCreateSubscription}
                loading={loading}
              />
            </div>

            {/* Payment Executor */}
            <div style={styles.section}>
              <PaymentExecutor
                dueSubscriptions={dueSubscriptions.length}
                totalPending={totalPending}
                onRunSubscriptions={handleRunAllDue}
                loading={loading}
              />
            </div>

            {/* Subscriptions Table */}
            <div style={styles.section}>
              <SubscriptionsTable
                subscriptions={subscriptions}
                onCancel={handleCancelSubscription}
                onExecute={handleExecutePayment}
                loading={loading}
              />
            </div>
          </>
        )}
      </main>

      <Footer />

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
