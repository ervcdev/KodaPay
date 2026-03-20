/**
 * Header Component - KodaPay 2077
 * Futuristic wallet dropdown with glow effects
 * @version 2.0
 */

import { useState } from 'react';

const styles = {
  header: {
    position: 'fixed',
    top: '20px',
    right: '32px',
    zIndex: 1000,
  },
  walletDropdown: {
    position: 'relative',
  },
  walletButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 16px',
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '50px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  walletButtonHover: {
    borderColor: 'rgba(230, 0, 122, 0.3)',
    boxShadow: '0 0 20px rgba(230, 0, 122, 0.15)',
  },
  walletAddress: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '12px',
    color: '#FFFFFF',
    textShadow: '0 0 10px rgba(230, 0, 122, 0.3)',
  },
  balanceChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    background: 'rgba(230, 0, 122, 0.15)',
    borderRadius: '20px',
  },
  balanceLabel: {
    fontSize: '9px',
    fontWeight: 600,
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  balanceValue: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '11px',
    fontWeight: 500,
    color: '#E6007A',
    textShadow: '0 0 10px rgba(230, 0, 122, 0.5)',
  },
  chevron: {
    color: 'rgba(255, 255, 255, 0.4)',
    width: '12px',
    height: '12px',
    transition: 'transform 0.2s ease',
  },
  chevronOpen: {
    transform: 'rotate(180deg)',
  },
  dropdown: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    right: 0,
    minWidth: '260px',
    background: 'rgba(15, 15, 18, 0.95)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
  },
  dropdownSection: {
    padding: '16px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },
  dropdownLabel: {
    fontSize: '9px',
    fontWeight: 600,
    color: 'rgba(255, 255, 255, 0.3)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '12px',
  },
  dropdownRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  dropdownRowLast: {
    marginBottom: 0,
  },
  balanceName: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  balanceAmount: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '13px',
    fontWeight: 500,
    color: '#FFFFFF',
    textShadow: '0 0 10px rgba(230, 0, 122, 0.3)',
  },
  networkBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 10px',
    background: 'rgba(0, 255, 136, 0.1)',
    borderRadius: '6px',
  },
  networkDot: {
    width: '6px',
    height: '6px',
    backgroundColor: '#00FF88',
    borderRadius: '50%',
    boxShadow: '0 0 8px rgba(0, 255, 136, 0.5)',
  },
  networkName: {
    fontSize: '11px',
    fontWeight: 500,
    color: '#00FF88',
    fontFamily: "'JetBrains Mono', monospace",
  },
  disconnectBtn: {
    display: 'block',
    width: '100%',
    padding: '14px 16px',
    background: 'transparent',
    border: 'none',
    fontSize: '13px',
    fontWeight: 500,
    color: '#FF3B30',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease',
  },
  connectBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #E6007A 0%, #FF1A8C 100%)',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '50px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: '0 0 30px rgba(230, 0, 122, 0.4)',
    transition: 'all 0.2s ease',
  },
  connectBtnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  walletIcon: {
    width: '16px',
    height: '16px',
  },
};

const ChevronIcon = ({ isOpen }) => (
  <svg 
    width="12" 
    height="12" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
    style={{
      ...styles.chevron,
      ...(isOpen ? styles.chevronOpen : {}),
    }}
  >
    <polyline points="6,9 12,15 18,9" />
  </svg>
);

const WalletIcon = () => (
  <svg style={styles.walletIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12V7H5a2 2 0 010-4h14v4"/>
    <path d="M3 5v14a2 2 0 002 2h16v-5"/>
    <path d="M18 12a2 2 0 100 4 2 2 0 000-4z"/>
  </svg>
);

export default function Header({
  account,
  chainId,
  loading,
  walletReady,
  wndBalance,
  usdtBalance,
  onConnect,
  onDisconnect
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatBalance = (balance) => {
    if (!balance) return '0.00';
    return parseFloat(balance).toFixed(2);
  };

  const getNetworkName = () => {
    if (chainId === 31337) return 'Local Testnet';
    if (chainId === 420420421) return 'Westend Revive';
    return 'Unknown';
  };

  return (
    <header style={styles.header}>
      {account ? (
        <div style={styles.walletDropdown}>
          <button
            style={{
              ...styles.walletButton,
              ...(isHovered ? styles.walletButtonHover : {}),
            }}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div style={styles.balanceChip}>
              <span style={styles.balanceLabel}>WND</span>
              <span style={styles.balanceValue}>{formatBalance(wndBalance)}</span>
            </div>
            <span style={styles.walletAddress}>{formatAddress(account)}</span>
            <ChevronIcon isOpen={isDropdownOpen} />
          </button>

          {isDropdownOpen && (
            <div style={styles.dropdown}>
              <div style={styles.dropdownSection}>
                <div style={styles.dropdownLabel}>Network</div>
                <div style={styles.networkBadge}>
                  <span style={styles.networkDot}></span>
                  <span style={styles.networkName}>{getNetworkName()}</span>
                </div>
              </div>
              <div style={styles.dropdownSection}>
                <div style={styles.dropdownLabel}>Balances</div>
                <div style={styles.dropdownRow}>
                  <span style={styles.balanceName}>WND</span>
                  <span style={styles.balanceAmount}>{formatBalance(wndBalance)}</span>
                </div>
                <div style={{...styles.dropdownRow, ...styles.dropdownRowLast}}>
                  <span style={styles.balanceName}>mUSDT</span>
                  <span style={styles.balanceAmount}>{formatBalance(usdtBalance)}</span>
                </div>
              </div>
              <button
                style={styles.disconnectBtn}
                onClick={() => {
                  setIsDropdownOpen(false);
                  onDisconnect();
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255, 59, 48, 0.1)'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                Disconnect
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          style={{
            ...styles.connectBtn,
            ...((!walletReady || loading) ? styles.connectBtnDisabled : {}),
          }}
          onClick={onConnect}
          disabled={!walletReady || loading}
          onMouseOver={(e) => {
            if (walletReady && !loading) e.target.style.boxShadow = '0 0 40px rgba(230, 0, 122, 0.6)';
          }}
          onMouseOut={(e) => {
            if (walletReady && !loading) e.target.style.boxShadow = '0 0 30px rgba(230, 0, 122, 0.4)';
          }}
        >
          <WalletIcon />
          {loading ? 'Connecting...' : 'Connect Wallet'}
        </button>
      )}
    </header>
  );
}
