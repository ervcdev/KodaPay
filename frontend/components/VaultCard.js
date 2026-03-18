/**
 * VaultCard Component
 * Displays user's vault balance with deposit/withdraw actions
 */

import { Wallet, ArrowDownToLine, ArrowUpFromLine, Loader2, Droplets } from 'lucide-react'

const styles = {
  card: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '24px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
  },
  iconBox: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    backgroundColor: 'var(--primary-light)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--primary)',
  },
  title: {
    fontSize: '18px',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  subtitle: {
    fontSize: '13px',
    color: 'var(--text-muted)',
    marginTop: '2px',
  },
  balanceBox: {
    backgroundColor: 'var(--bg-input)',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    textAlign: 'center',
  },
  balanceLabel: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    marginBottom: '8px',
  },
  balanceAmount: {
    fontSize: '48px',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  balanceUnit: {
    fontSize: '18px',
    color: 'var(--text-secondary)',
    marginLeft: '8px',
  },
  walletInfo: {
    display: 'flex',
    justifyContent: 'center',
    gap: '24px',
    marginTop: '16px',
    fontSize: '13px',
  },
  walletLabel: {
    color: 'var(--text-muted)',
  },
  walletValue: {
    color: 'var(--text-secondary)',
    fontFamily: 'monospace',
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  actionGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--text-secondary)',
  },
  inputRow: {
    display: 'flex',
    gap: '8px',
  },
  input: {
    flex: 1,
    padding: '12px 16px',
    backgroundColor: 'var(--bg-input)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    fontSize: '14px',
    color: 'var(--text-primary)',
    outline: 'none',
  },
  btnPrimary: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    borderRadius: '8px',
    backgroundColor: 'var(--primary)',
    color: 'white',
    fontWeight: 500,
    fontSize: '14px',
    border: 'none',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  btnSecondary: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    borderRadius: '8px',
    backgroundColor: 'var(--bg-input)',
    color: 'var(--text-primary)',
    fontWeight: 500,
    fontSize: '14px',
    border: '1px solid var(--border)',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  faucetSection: {
    marginTop: '24px',
    paddingTop: '24px',
    borderTop: '1px solid var(--border)',
  },
  faucetBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px 16px',
    borderRadius: '8px',
    backgroundColor: 'var(--bg-input)',
    color: 'var(--text-primary)',
    fontWeight: 500,
    fontSize: '14px',
    border: '1px solid var(--border)',
    cursor: 'pointer',
  },
}

export default function VaultCard({
  vaultBalance,
  usdtBalance,
  walletBalance,
  depositAmount,
  setDepositAmount,
  withdrawAmount,
  setWithdrawAmount,
  onDeposit,
  onWithdraw,
  onFaucet,
  loading,
  faucetAmount
}) {
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.iconBox}>
          <Wallet size={20} />
        </div>
        <div>
          <h2 style={styles.title}>My Vault</h2>
          <p style={styles.subtitle}>Manage your subscription funds</p>
        </div>
      </div>

      <div style={styles.balanceBox}>
        <p style={styles.balanceLabel}>Vault Balance</p>
        <div>
          <span style={styles.balanceAmount}>{parseFloat(vaultBalance).toFixed(2)}</span>
          <span style={styles.balanceUnit}>ppUSD</span>
        </div>
        <div style={styles.walletInfo}>
          <div>
            <span style={styles.walletLabel}>Wallet: </span>
            <span style={styles.walletValue}>{parseFloat(usdtBalance).toFixed(2)} mUSDT</span>
          </div>
          <div>
            <span style={styles.walletLabel}>Native: </span>
            <span style={styles.walletValue}>{parseFloat(walletBalance).toFixed(4)} ETH</span>
          </div>
        </div>
      </div>

      <div style={styles.actionsGrid}>
        <div style={styles.actionGroup}>
          <label style={styles.label}>Deposit to Vault</label>
          <div style={styles.inputRow}>
            <input
              type="number"
              placeholder="Amount"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              style={styles.input}
              min="0"
              step="0.01"
            />
            <button
              onClick={onDeposit}
              disabled={loading || !depositAmount}
              style={{...styles.btnPrimary, opacity: (loading || !depositAmount) ? 0.5 : 1}}
            >
              {loading ? <Loader2 size={16} style={{animation: 'spin 1s linear infinite'}} /> : <ArrowDownToLine size={16} />}
              Deposit
            </button>
          </div>
        </div>

        <div style={styles.actionGroup}>
          <label style={styles.label}>Withdraw from Vault</label>
          <div style={styles.inputRow}>
            <input
              type="number"
              placeholder="Amount"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              style={styles.input}
              min="0"
              step="0.01"
            />
            <button
              onClick={onWithdraw}
              disabled={loading || !withdrawAmount}
              style={{...styles.btnSecondary, opacity: (loading || !withdrawAmount) ? 0.5 : 1}}
            >
              {loading ? <Loader2 size={16} style={{animation: 'spin 1s linear infinite'}} /> : <ArrowUpFromLine size={16} />}
              Withdraw
            </button>
          </div>
        </div>
      </div>

      <div style={styles.faucetSection}>
        <button
          onClick={onFaucet}
          disabled={loading}
          style={{...styles.faucetBtn, opacity: loading ? 0.5 : 1}}
        >
          {loading ? <Loader2 size={16} style={{animation: 'spin 1s linear infinite'}} /> : <Droplets size={16} />}
          Get {faucetAmount} mUSDT (Testnet Faucet)
        </button>
      </div>
    </div>
  )
}
