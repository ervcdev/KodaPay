/**
 * VaultCard Component
 * Displays user's vault balance with deposit/withdraw actions
 */

import { Wallet, ArrowDownToLine, ArrowUpFromLine, Loader2, Droplets } from 'lucide-react'

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
    <div className="card card-glow">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Wallet className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">My Vault</h2>
            <p className="text-sm text-text-muted">Manage your subscription funds</p>
          </div>
        </div>
      </div>

      {/* Balance Display */}
      <div className="bg-background-elevated rounded-xl p-6 mb-6">
        <p className="text-sm text-text-secondary mb-1">Vault Balance</p>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-white">{parseFloat(vaultBalance).toFixed(2)}</span>
          <span className="text-lg text-text-secondary">ppUSD</span>
        </div>
        <div className="flex gap-4 mt-4 text-sm">
          <div>
            <span className="text-text-muted">Wallet: </span>
            <span className="text-text-secondary font-mono">{parseFloat(usdtBalance).toFixed(2)} mUSDT</span>
          </div>
          <div>
            <span className="text-text-muted">Native: </span>
            <span className="text-text-secondary font-mono">{parseFloat(walletBalance).toFixed(4)} ETH</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Deposit */}
        <div className="space-y-3">
          <label className="label">Deposit to Vault</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Amount"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="input flex-1"
              min="0"
              step="0.01"
            />
            <button
              onClick={onDeposit}
              disabled={loading || !depositAmount}
              className="btn-primary flex items-center gap-2 whitespace-nowrap"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowDownToLine className="w-4 h-4" />
              )}
              Deposit
            </button>
          </div>
        </div>

        {/* Withdraw */}
        <div className="space-y-3">
          <label className="label">Withdraw from Vault</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Amount"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              className="input flex-1"
              min="0"
              step="0.01"
            />
            <button
              onClick={onWithdraw}
              disabled={loading || !withdrawAmount}
              className="btn-secondary flex items-center gap-2 whitespace-nowrap"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowUpFromLine className="w-4 h-4" />
              )}
              Withdraw
            </button>
          </div>
        </div>
      </div>

      {/* Faucet */}
      <div className="mt-6 pt-6 border-t border-border">
        <button
          onClick={onFaucet}
          disabled={loading}
          className="w-full btn-secondary flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Droplets className="w-4 h-4" />
          )}
          Get {faucetAmount} mUSDT (Testnet Faucet)
        </button>
      </div>
    </div>
  )
}
