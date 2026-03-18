/**
 * SubscriptionsTable Component
 * Displays active subscriptions with management actions
 */

import { Repeat, Trash2, Clock, AlertCircle } from 'lucide-react'

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

  const formatDate = (timestamp) => {
    if (!timestamp || timestamp === '0') return 'N/A'
    const date = new Date(parseInt(timestamp) * 1000)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const calculateNextPayment = (lastPayment, frequency) => {
    if (!lastPayment || lastPayment === '0') return 'Pending'
    const nextDate = new Date((parseInt(lastPayment) + parseInt(frequency)) * 1000)
    return nextDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const activeSubscriptions = subscriptions.filter(sub => sub.active)

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Repeat className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Active Subscriptions</h2>
            <p className="text-sm text-text-muted">
              {activeSubscriptions.length} active subscription{activeSubscriptions.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      {activeSubscriptions.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-background-elevated mx-auto mb-4 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-text-muted" />
          </div>
          <p className="text-text-secondary">No active subscriptions</p>
          <p className="text-sm text-text-muted mt-1">Create your first subscription above</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Recipient</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Next Payment</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Status</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {activeSubscriptions.map((sub) => (
                <tr key={sub.id} className="border-b border-border/50 hover:bg-background-elevated/50 transition-colors">
                  <td className="py-4 px-4">
                    <span className="font-mono text-sm text-white">{shortenAddress(sub.receiver)}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-white font-medium">{sub.amount}</span>
                    <span className="text-text-muted text-sm ml-1">USDT</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-text-muted" />
                      <span className="text-text-secondary text-sm">
                        {calculateNextPayment(sub.lastPayment, sub.frequency)}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {sub.isDue ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-warning/10 text-warning text-xs font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-warning"></span>
                        Payment Due
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                        Active
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {sub.isDue && (
                        <button
                          onClick={() => onExecute(sub.id)}
                          disabled={loading}
                          className="text-sm text-primary hover:text-primary-light transition-colors"
                        >
                          Execute
                        </button>
                      )}
                      <button
                        onClick={() => onCancel(sub.id)}
                        disabled={loading}
                        className="btn-danger text-sm flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
