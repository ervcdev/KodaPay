/**
 * SubscriptionsTable Component
 * Displays active subscriptions with management actions
 */

import { Repeat, Trash2, Clock, AlertCircle } from 'lucide-react'

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
    justifyContent: 'space-between',
    marginBottom: '24px',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
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
  empty: {
    textAlign: 'center',
    padding: '48px 24px',
  },
  emptyIcon: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    backgroundColor: 'var(--bg-input)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
    color: 'var(--text-muted)',
  },
  emptyText: {
    color: 'var(--text-secondary)',
    marginBottom: '4px',
  },
  emptyHint: {
    fontSize: '13px',
    color: 'var(--text-muted)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '12px 16px',
    fontSize: '12px',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--text-muted)',
    borderBottom: '1px solid var(--border)',
  },
  thRight: {
    textAlign: 'right',
    padding: '12px 16px',
    fontSize: '12px',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--text-muted)',
    borderBottom: '1px solid var(--border)',
  },
  td: {
    padding: '16px',
    fontSize: '14px',
    color: 'var(--text-secondary)',
    borderBottom: '1px solid var(--border)',
  },
  tdRight: {
    padding: '16px',
    textAlign: 'right',
    borderBottom: '1px solid var(--border)',
  },
  mono: {
    fontFamily: 'monospace',
    fontSize: '13px',
    color: 'var(--text-primary)',
  },
  amount: {
    color: 'var(--text-primary)',
    fontWeight: 500,
  },
  amountUnit: {
    color: 'var(--text-muted)',
    fontSize: '13px',
    marginLeft: '4px',
  },
  clockRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: 'var(--text-secondary)',
    fontSize: '13px',
  },
  badgeActive: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    borderRadius: '100px',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    color: 'var(--success)',
    fontSize: '12px',
    fontWeight: 500,
  },
  badgeDue: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    borderRadius: '100px',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    color: 'var(--warning)',
    fontSize: '12px',
    fontWeight: 500,
  },
  dot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '8px',
  },
  executeBtn: {
    fontSize: '13px',
    color: 'var(--primary)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 500,
  },
  cancelBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '6px 10px',
    borderRadius: '6px',
    backgroundColor: 'transparent',
    color: 'var(--danger)',
    fontSize: '13px',
    border: '1px solid var(--danger)',
    cursor: 'pointer',
  },
}

export default function SubscriptionsTable({
  subscriptions,
  onCancel,
  onExecute,
  loading
}) {
  const shortenAddress = (address) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const calculateNextPayment = (lastPayment, frequency) => {
    if (!lastPayment || lastPayment === '0') return 'Pending'
    const nextDate = new Date((parseInt(lastPayment) + parseInt(frequency)) * 1000)
    return nextDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const activeSubscriptions = subscriptions.filter(sub => sub.active)

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.iconBox}>
            <Repeat size={20} />
          </div>
          <div>
            <h2 style={styles.title}>Active Subscriptions</h2>
            <p style={styles.subtitle}>
              {activeSubscriptions.length} active subscription{activeSubscriptions.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {activeSubscriptions.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>
            <AlertCircle size={32} />
          </div>
          <p style={styles.emptyText}>No active subscriptions</p>
          <p style={styles.emptyHint}>Create your first subscription above</p>
        </div>
      ) : (
        <div style={{overflowX: 'auto'}}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Recipient</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Next Payment</th>
                <th style={styles.th}>Status</th>
                <th style={styles.thRight}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {activeSubscriptions.map((sub) => (
                <tr key={sub.id}>
                  <td style={styles.td}>
                    <span style={styles.mono}>{shortenAddress(sub.receiver)}</span>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.amount}>{sub.amount}</span>
                    <span style={styles.amountUnit}>USDT</span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.clockRow}>
                      <Clock size={14} style={{color: 'var(--text-muted)'}} />
                      <span>{calculateNextPayment(sub.lastPayment, sub.frequency)}</span>
                    </div>
                  </td>
                  <td style={styles.td}>
                    {sub.isDue ? (
                      <span style={styles.badgeDue}>
                        <span style={{...styles.dot, backgroundColor: 'var(--warning)'}}></span>
                        Payment Due
                      </span>
                    ) : (
                      <span style={styles.badgeActive}>
                        <span style={{...styles.dot, backgroundColor: 'var(--success)'}}></span>
                        Active
                      </span>
                    )}
                  </td>
                  <td style={styles.tdRight}>
                    <div style={styles.actions}>
                      {sub.isDue && (
                        <button
                          onClick={() => onExecute(sub.id)}
                          disabled={loading}
                          style={styles.executeBtn}
                        >
                          Execute
                        </button>
                      )}
                      <button
                        onClick={() => onCancel(sub.id)}
                        disabled={loading}
                        style={styles.cancelBtn}
                      >
                        <Trash2 size={14} />
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
