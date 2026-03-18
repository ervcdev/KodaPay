/**
 * Header Component
 * Displays project branding, network status, and wallet connection
 */

import { Wallet, Loader2 } from 'lucide-react'

export default function Header({
  account,
  chainId,
  loading,
  walletReady,
  onConnect,
  onDisconnect
}) {
  const shortenAddress = (address) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <header className="border-b border-border bg-background-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-semibold text-white">SubScript</span>
          </div>

          {/* Network Status & Wallet */}
          <div className="flex items-center gap-4">
            {/* Network Indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-background-elevated border border-border">
              <span className="w-2 h-2 rounded-full bg-success status-pulse"></span>
              <span className="text-sm text-text-secondary">
                {chainId === 31337 ? 'Local Hardhat' : chainId === 420420421 ? 'Westend Revive' : 'Unknown Network'}
              </span>
            </div>

            {/* Wallet Button */}
            {!account ? (
              <button
                onClick={onConnect}
                disabled={!walletReady || loading}
                className="btn-primary flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <Wallet className="w-4 h-4" />
                    <span>Connect Wallet</span>
                  </>
                )}
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-sm font-medium text-white font-mono">
                    {shortenAddress(account)}
                  </span>
                </div>
                <button
                  onClick={onDisconnect}
                  className="btn-secondary text-sm"
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
