/**
 * Header Component - KodaPay
 * Ultra-minimalist navbar with wallet connection
 */

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 48px',
    borderBottom: '1px solid #E5E5E5',
    backgroundColor: '#FFFFFF',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  logoText: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#121212',
    letterSpacing: '-0.5px',
  },
  logoPink: {
    color: '#E6007A',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  walletInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  balanceGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '10px 20px',
    border: '1px solid #E5E5E5',
    backgroundColor: '#FAFAFA',
  },
  balanceItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  balanceLabel: {
    fontSize: '11px',
    color: '#737373',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  balanceValue: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#121212',
    fontFamily: "'JetBrains Mono', monospace",
  },
  divider: {
    width: '1px',
    height: '20px',
    backgroundColor: '#E5E5E5',
  },
  address: {
    fontSize: '13px',
    fontFamily: "'JetBrains Mono', monospace",
    color: '#525252',
    padding: '10px 16px',
    border: '1px solid #E5E5E5',
    backgroundColor: '#FAFAFA',
  },
  connectBtn: {
    padding: '12px 24px',
    backgroundColor: '#121212',
    color: '#FFFFFF',
    border: 'none',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
  },
  disconnectBtn: {
    padding: '10px 16px',
    backgroundColor: 'transparent',
    color: '#737373',
    border: '1px solid #E5E5E5',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
  },
};

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
  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatBalance = (balance) => {
    if (!balance) return '0.00';
    return parseFloat(balance).toFixed(2);
  };

  const getNetworkName = () => {
    if (chainId === 31337) return 'Local';
    if (chainId === 420420421) return 'Westend';
    return 'Unknown';
  };

  return (
    <header style={styles.header}>
      <div style={styles.logo}>
        <span style={styles.logoText}>
          Koda<span style={styles.logoPink}>Pay</span>
        </span>
      </div>

      <nav style={styles.nav}>
        {account ? (
          <div style={styles.walletInfo}>
            <div style={styles.balanceGroup}>
              <div style={styles.balanceItem}>
                <span style={styles.balanceLabel}>WND</span>
                <span style={styles.balanceValue}>{formatBalance(wndBalance)}</span>
              </div>
              <div style={styles.divider} />
              <div style={styles.balanceItem}>
                <span style={styles.balanceLabel}>mUSDT</span>
                <span style={styles.balanceValue}>{formatBalance(usdtBalance)}</span>
              </div>
            </div>
            <span style={styles.address}>{formatAddress(account)}</span>
            <button 
              style={styles.disconnectBtn}
              onClick={onDisconnect}
              onMouseOver={(e) => e.target.style.borderColor = '#D4D4D4'}
              onMouseOut={(e) => e.target.style.borderColor = '#E5E5E5'}
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button 
            style={{
              ...styles.connectBtn,
              opacity: (!walletReady || loading) ? 0.6 : 1,
              cursor: (!walletReady || loading) ? 'not-allowed' : 'pointer',
            }}
            onClick={onConnect}
            disabled={!walletReady || loading}
            onMouseOver={(e) => {
              if (walletReady && !loading) e.target.style.backgroundColor = '#2a2a2a';
            }}
            onMouseOut={(e) => {
              if (walletReady && !loading) e.target.style.backgroundColor = '#121212';
            }}
          >
            {loading ? 'Connecting...' : 'Connect Wallet'}
          </button>
        )}
      </nav>
    </header>
  );
}
