/**
 * SubscriptionForm Component
 * Form for creating new recurring subscriptions
 */

import { Repeat, Loader2, CreditCard } from 'lucide-react'

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
  inputGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    backgroundColor: 'var(--bg-input)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    fontSize: '14px',
    color: 'var(--text-primary)',
    outline: 'none',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  summary: {
    backgroundColor: 'var(--bg-input)',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
    fontSize: '13px',
    color: 'var(--text-secondary)',
    lineHeight: 1.6,
  },
  highlight: {
    color: 'var(--text-primary)',
    fontWeight: 500,
  },
  mono: {
    fontFamily: 'monospace',
    fontSize: '12px',
    color: 'var(--text-primary)',
  },
  btn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '14px 20px',
    borderRadius: '8px',
    backgroundColor: 'var(--primary)',
    color: 'white',
    fontWeight: 500,
    fontSize: '15px',
    border: 'none',
    cursor: 'pointer',
  },
}

export default function SubscriptionForm({
  receiver,
  setReceiver,
  amount,
  setAmount,
  frequency,
  setFrequency,
  onCreateSubscription,
  loading
}) {
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.iconBox}>
          <CreditCard size={20} />
        </div>
        <div>
          <h2 style={styles.title}>Create Subscription</h2>
          <p style={styles.subtitle}>Set up a new recurring payment</p>
        </div>
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>Receiver Wallet Address</label>
        <input
          type="text"
          placeholder="0x..."
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
          style={{...styles.input, fontFamily: 'monospace'}}
        />
      </div>

      <div style={{...styles.row, marginBottom: '16px'}}>
        <div>
          <label style={styles.label}>Amount (USDT)</label>
          <input
            type="number"
            placeholder="10.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={styles.input}
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <label style={styles.label}>Frequency (Days)</label>
          <input
            type="number"
            placeholder="30"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            style={styles.input}
            min="1"
          />
        </div>
      </div>

      {receiver && amount && frequency && (
        <div style={styles.summary}>
          This will send <span style={styles.highlight}>{amount} USDT</span> every{' '}
          <span style={styles.highlight}>{frequency} days</span> to{' '}
          <span style={styles.mono}>
            {receiver.slice(0, 10)}...{receiver.slice(-8)}
          </span>
        </div>
      )}

      <button
        onClick={onCreateSubscription}
        disabled={loading || !receiver || !amount || !frequency}
        style={{...styles.btn, opacity: (loading || !receiver || !amount || !frequency) ? 0.5 : 1}}
      >
        {loading ? (
          <>
            <Loader2 size={18} style={{animation: 'spin 1s linear infinite'}} />
            <span>Creating Subscription...</span>
          </>
        ) : (
          <>
            <Repeat size={18} />
            <span>Create Subscription</span>
          </>
        )}
      </button>
    </div>
  )
}
