/**
 * SubscriptionForm Component
 * Form for creating new recurring subscriptions
 */

import { Repeat, Loader2, CreditCard } from 'lucide-react'

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
    <div className="card">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <CreditCard className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Create Subscription</h2>
          <p className="text-sm text-text-muted">Set up a new recurring payment</p>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-4">
        {/* Receiver Address */}
        <div>
          <label className="label">Receiver Wallet Address</label>
          <input
            type="text"
            placeholder="0x..."
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
            className="input font-mono"
          />
        </div>

        {/* Amount and Frequency Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Amount (USDT)</label>
            <input
              type="number"
              placeholder="10.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="label">Frequency (Days)</label>
            <input
              type="number"
              placeholder="30"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="input"
              min="1"
            />
          </div>
        </div>

        {/* Summary */}
        {receiver && amount && frequency && (
          <div className="bg-background-elevated rounded-lg p-4">
            <p className="text-sm text-text-secondary">
              This will send <span className="text-white font-medium">{amount} USDT</span> every{' '}
              <span className="text-white font-medium">{frequency} days</span> to{' '}
              <span className="text-white font-mono text-xs">
                {receiver.slice(0, 10)}...{receiver.slice(-8)}
              </span>
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={onCreateSubscription}
          disabled={loading || !receiver || !amount || !frequency}
          className="w-full btn-primary flex items-center justify-center gap-2 py-3"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Creating Subscription...</span>
            </>
          ) : (
            <>
              <Repeat className="w-5 h-5" />
              <span>Create Subscription</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
