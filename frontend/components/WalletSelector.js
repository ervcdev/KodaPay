/**
 * Wallet Selection Component for KodaPay
 * Allows users to explicitly choose between Talisman and MetaMask
 */

import { useState, useEffect } from 'react'

export default function WalletSelector({ onWalletSelect, onCancel }) {
  const [availableWallets, setAvailableWallets] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    detectWallets()
  }, [])

  const detectWallets = () => {
    const wallets = []

    // Check for Talisman (prioritized)
    if (typeof window !== 'undefined') {
      if (window.talismanEth) {
        wallets.push({
          id: 'talisman-eth',
          name: 'Talisman',
          description: 'Polkadot & Ethereum Wallet (Recommended)',
          provider: window.talismanEth,
          icon: '🔮',
          recommended: true,
          isTalisman: true
        })
      } else if (window.ethereum?.isTalisman) {
        wallets.push({
          id: 'talisman',
          name: 'Talisman',
          description: 'Polkadot & Ethereum Wallet (Recommended)',
          provider: window.ethereum,
          icon: '🔮',
          recommended: true,
          isTalisman: true
        })
      }

      // Check for MetaMask
      if (window.ethereum?.isMetaMask && !window.ethereum?.isTalisman) {
        wallets.push({
          id: 'metamask',
          name: 'MetaMask',
          description: 'Ethereum Wallet',
          provider: window.ethereum,
          icon: '🦊',
          recommended: false,
          isMetaMask: true
        })
      }

      // Check for other wallets
      if (window.SubWallet) {
        wallets.push({
          id: 'subwallet',
          name: 'SubWallet',
          description: 'Polkadot & Ethereum Wallet',
          provider: window.SubWallet,
          icon: '⚡',
          recommended: false,
          isSubWallet: true
        })
      }
    }

    setAvailableWallets(wallets)
    setIsLoading(false)
  }

  const handleWalletSelect = (wallet) => {
    console.log(`🎯 User selected wallet: ${wallet.name}`)
    onWalletSelect(wallet)
  }

  if (isLoading) {
    return (
      <div className="wallet-selector-overlay">
        <div className="wallet-selector-modal">
          <div className="loading">
            <div className="spinner"></div>
            <p>Detecting wallets...</p>
          </div>
        </div>
      </div>
    )
  }

  if (availableWallets.length === 0) {
    return (
      <div className="wallet-selector-overlay">
        <div className="wallet-selector-modal">
          <h3>No Wallets Detected</h3>
          <p>Please install a compatible wallet to continue:</p>
          <div className="wallet-install-links">
            <a 
              href="https://talisman.xyz/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="install-link recommended"
            >
              🔮 Install Talisman (Recommended)
            </a>
            <a 
              href="https://metamask.io/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="install-link"
            >
              🦊 Install MetaMask
            </a>
          </div>
          <button onClick={onCancel} className="cancel-btn">
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="wallet-selector-overlay">
      <div className="wallet-selector-modal">
        <h3>Choose Your Wallet</h3>
        <p>Select a wallet to connect to KodaPay:</p>
        
        <div className="wallet-options">
          {availableWallets.map((wallet) => (
            <button
              key={wallet.id}
              onClick={() => handleWalletSelect(wallet)}
              className={`wallet-option ${wallet.recommended ? 'recommended' : ''}`}
            >
              <div className="wallet-icon">{wallet.icon}</div>
              <div className="wallet-info">
                <div className="wallet-name">
                  {wallet.name}
                  {wallet.recommended && <span className="badge">Recommended</span>}
                </div>
                <div className="wallet-description">{wallet.description}</div>
              </div>
              <div className="connect-arrow">→</div>
            </button>
          ))}
        </div>

        <div className="wallet-selector-footer">
          <button onClick={onCancel} className="cancel-btn">
            Cancel
          </button>
          <div className="help-text">
            💡 Talisman is recommended for the best Polkadot experience
          </div>
        </div>
      </div>

      <style jsx>{`
        .wallet-selector-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
        }

        .wallet-selector-modal {
          background: white;
          border-radius: 16px;
          padding: 24px;
          max-width: 400px;
          width: 90%;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .wallet-selector-modal h3 {
          margin: 0 0 8px 0;
          font-size: 20px;
          font-weight: 600;
          color: #1a1a1a;
        }

        .wallet-selector-modal p {
          margin: 0 0 20px 0;
          color: #666;
          font-size: 14px;
        }

        .wallet-options {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }

        .wallet-option {
          display: flex;
          align-items: center;
          padding: 16px;
          border: 2px solid #e5e5e5;
          border-radius: 12px;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .wallet-option:hover {
          border-color: #007bff;
          background: #f8f9ff;
          transform: translateY(-1px);
        }

        .wallet-option.recommended {
          border-color: #28a745;
          background: #f8fff9;
        }

        .wallet-option.recommended:hover {
          border-color: #1e7e34;
          background: #e8f5e8;
        }

        .wallet-icon {
          font-size: 24px;
          margin-right: 12px;
          min-width: 32px;
        }

        .wallet-info {
          flex: 1;
        }

        .wallet-name {
          font-weight: 600;
          font-size: 16px;
          color: #1a1a1a;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }

        .badge {
          background: #28a745;
          color: white;
          font-size: 10px;
          font-weight: 500;
          padding: 2px 6px;
          border-radius: 4px;
          text-transform: uppercase;
        }

        .wallet-description {
          font-size: 12px;
          color: #666;
        }

        .connect-arrow {
          font-size: 18px;
          color: #999;
          margin-left: 12px;
        }

        .wallet-install-links {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }

        .install-link {
          display: block;
          padding: 12px 16px;
          border: 2px solid #e5e5e5;
          border-radius: 8px;
          text-decoration: none;
          color: #1a1a1a;
          font-weight: 500;
          text-align: center;
          transition: all 0.2s ease;
        }

        .install-link:hover {
          border-color: #007bff;
          background: #f8f9ff;
        }

        .install-link.recommended {
          border-color: #28a745;
          background: #f8fff9;
        }

        .wallet-selector-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid #e5e5e5;
        }

        .cancel-btn {
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          color: #6c757d;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .cancel-btn:hover {
          background: #e9ecef;
          border-color: #adb5bd;
        }

        .help-text {
          font-size: 12px;
          color: #666;
          max-width: 200px;
          text-align: right;
        }

        .loading {
          text-align: center;
          padding: 40px 20px;
        }

        .spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid #007bff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 16px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading p {
          margin: 0;
          color: #666;
        }
      `}</style>
    </div>
  )
}
