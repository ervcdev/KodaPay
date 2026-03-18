/**
 * ActivityLog Component
 * Displays recent transaction activity
 */

import { Activity, ArrowDownToLine, ArrowUpFromLine, XCircle, Repeat, CheckCircle } from 'lucide-react'

const mockActivity = [
  { id: 1, type: 'deposit', amount: '100', timestamp: Date.now() - 3600000, status: 'success' },
  { id: 2, type: 'payment', amount: '10', recipient: '0x742d35Cc6634C0532925a3b844Bc9e7595f99999', timestamp: Date.now() - 7200000, status: 'success' },
  { id: 3, type: 'cancel', subscriptionId: '1', timestamp: Date.now() - 86400000, status: 'success' },
]

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
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: 'var(--bg-input)',
  },
  itemLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  itemIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'var(--bg-card)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: '14px',
    color: 'var(--text-primary)',
    marginBottom: '2px',
  },
  itemTime: {
    fontSize: '12px',
    color: 'var(--text-muted)',
  },
  status: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    color: 'var(--success)',
    fontSize: '12px',
  },
  empty: {
    textAlign: 'center',
    padding: '32px',
    color: 'var(--text-secondary)',
  },
}

export default function ActivityLog({ activities = mockActivity }) {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownToLine size={16} style={{color: 'var(--success)'}} />
      case 'withdraw':
        return <ArrowUpFromLine size={16} style={{color: 'var(--warning)'}} />
      case 'payment':
        return <Repeat size={16} style={{color: 'var(--primary)'}} />
      case 'cancel':
        return <XCircle size={16} style={{color: 'var(--danger)'}} />
      default:
        return <Activity size={16} style={{color: 'var(--text-muted)'}} />
    }
  }

  const getActivityLabel = (activity) => {
    switch (activity.type) {
      case 'deposit':
        return `Deposited ${activity.amount} USDT to vault`
      case 'withdraw':
        return `Withdrew ${activity.amount} USDT from vault`
      case 'payment':
        return `Subscription payment of ${activity.amount} USDT`
      case 'cancel':
        return `Cancelled subscription #${activity.subscriptionId}`
      default:
        return 'Unknown activity'
    }
  }

  const formatTimeAgo = (timestamp) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000)
    if (seconds < 60) return 'Just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.iconBox}>
          <Activity size={20} />
        </div>
        <div>
          <h2 style={styles.title}>Recent Activity</h2>
          <p style={styles.subtitle}>Your recent transactions</p>
        </div>
      </div>

      {activities.length === 0 ? (
        <div style={styles.empty}>No recent activity</div>
      ) : (
        <div style={styles.list}>
          {activities.map((activity) => (
            <div key={activity.id} style={styles.item}>
              <div style={styles.itemLeft}>
                <div style={styles.itemIcon}>
                  {getActivityIcon(activity.type)}
                </div>
                <div>
                  <p style={styles.itemTitle}>{getActivityLabel(activity)}</p>
                  <p style={styles.itemTime}>{formatTimeAgo(activity.timestamp)}</p>
                </div>
              </div>
              <div style={styles.status}>
                <CheckCircle size={14} />
                <span>Success</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
