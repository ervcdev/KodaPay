/**
 * ActivityLog Component
 * Displays recent transaction activity
 */

import { Activity, ArrowDownToLine, ArrowUpFromLine, XCircle, Repeat, CheckCircle } from 'lucide-react'

// Mock activity data - will be replaced with real events from contract
const mockActivity = [
  { id: 1, type: 'deposit', amount: '100', timestamp: Date.now() - 3600000, status: 'success' },
  { id: 2, type: 'payment', amount: '10', recipient: '0x742d35Cc6634C0532925a3b844Bc9e7595f99999', timestamp: Date.now() - 7200000, status: 'success' },
  { id: 3, type: 'cancel', subscriptionId: '1', timestamp: Date.now() - 86400000, status: 'success' },
]

export default function ActivityLog({ activities = mockActivity }) {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownToLine className="w-4 h-4 text-success" />
      case 'withdraw':
        return <ArrowUpFromLine className="w-4 h-4 text-warning" />
      case 'payment':
        return <Repeat className="w-4 h-4 text-primary" />
      case 'cancel':
        return <XCircle className="w-4 h-4 text-danger" />
      default:
        return <Activity className="w-4 h-4 text-text-muted" />
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
    <div className="card">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Activity className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
          <p className="text-sm text-text-muted">Your recent transactions</p>
        </div>
      </div>

      {/* Activity List */}
      {activities.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-text-secondary">No recent activity</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-3 rounded-lg bg-background-elevated hover:bg-border/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-background-card flex items-center justify-center">
                  {getActivityIcon(activity.type)}
                </div>
                <div>
                  <p className="text-sm text-white">{getActivityLabel(activity)}</p>
                  <p className="text-xs text-text-muted">{formatTimeAgo(activity.timestamp)}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-success">
                <CheckCircle className="w-4 h-4" />
                <span className="text-xs">Success</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
