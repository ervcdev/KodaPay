/**
 * QuickTools Component - KodaPay 2077
 * Futuristic utility panel with glow effects
 */

const styles = {
  container: {
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '16px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  header: {
    padding: '24px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  iconWrapper: {
    width: '36px',
    height: '36px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: '18px',
    height: '18px',
    color: 'rgba(255, 255, 255, 0.5)',
    strokeWidth: '1.5',
  },
  title: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.4)',
    marginTop: '4px',
    marginLeft: '48px',
  },
  body: {
    padding: '24px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  toolCard: {
    background: 'rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    transition: 'all 0.2s ease',
  },
  toolIcon: {
    width: '44px',
    height: '44px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  toolInfo: {
    flex: 1,
  },
  toolTitle: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#FFFFFF',
    marginBottom: '4px',
  },
  toolDesc: {
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.4)',
  },
  toolBtn: {
    padding: '10px 18px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: 500,
    color: 'rgba(255, 255, 255, 0.7)',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s ease',
  },
  toolBtnPrimary: {
    background: 'linear-gradient(135deg, #E6007A 0%, #FF1A8C 100%)',
    borderColor: 'transparent',
    color: '#FFFFFF',
    boxShadow: '0 0 20px rgba(230, 0, 122, 0.3)',
  },
  toolBtnDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    background: 'rgba(0, 255, 136, 0.08)',
    border: '1px solid rgba(0, 255, 136, 0.2)',
    borderRadius: '10px',
    marginTop: 'auto',
  },
  badgeIcon: {
    width: '16px',
    height: '16px',
    color: '#00FF88',
    filter: 'drop-shadow(0 0 6px rgba(0, 255, 136, 0.5))',
  },
  badgeText: {
    fontSize: '11px',
    fontWeight: 500,
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: '0.3px',
  },
  badgeMono: {
    fontFamily: "'JetBrains Mono', monospace",
    color: '#00FF88',
    fontWeight: 600,
    textShadow: '0 0 10px rgba(0, 255, 136, 0.5)',
  },
};

const ToolboxIcon = () => (
  <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
  </svg>
);

const FaucetIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5">
    <path d="M12 2v6M12 22v-6M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M2 12h6M22 12h-6M4.93 19.07l4.24-4.24M14.83 9.17l4.24-4.24"/>
  </svg>
);

const TokenIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 6v12M8 10h8M8 14h8"/>
  </svg>
);

const CheckIcon = () => (
  <svg style={styles.badgeIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
    <polyline points="22,4 12,14.01 9,11.01"/>
  </svg>
);

export default function QuickTools({ onMintFaucet, onAddToken, loading }) {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.titleRow}>
          <div style={styles.iconWrapper}>
            <ToolboxIcon />
          </div>
          <span style={styles.title}>Quick Tools</span>
        </div>
        <div style={styles.subtitle}>Testnet utilities and token management</div>
      </div>
      
      <div style={styles.body}>
        {/* Faucet Tool */}
        <div 
          style={styles.toolCard}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = 'rgba(230, 0, 122, 0.2)';
            e.currentTarget.style.background = 'rgba(230, 0, 122, 0.05)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.2)';
          }}
        >
          <div style={styles.toolIcon}>
            <FaucetIcon />
          </div>
          <div style={styles.toolInfo}>
            <div style={styles.toolTitle}>Testnet Faucet</div>
            <div style={styles.toolDesc}>Get 100 mUSDT for testing</div>
          </div>
          <button
            style={{
              ...styles.toolBtn,
              ...styles.toolBtnPrimary,
              ...(loading ? styles.toolBtnDisabled : {}),
            }}
            onClick={onMintFaucet}
            disabled={loading}
            onMouseOver={(e) => {
              if (!loading) e.target.style.boxShadow = '0 0 30px rgba(230, 0, 122, 0.5)';
            }}
            onMouseOut={(e) => {
              if (!loading) e.target.style.boxShadow = '0 0 20px rgba(230, 0, 122, 0.3)';
            }}
          >
            {loading ? 'Minting...' : 'Mint'}
          </button>
        </div>

        {/* Add Token Tool */}
        <div 
          style={styles.toolCard}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.2)';
          }}
        >
          <div style={styles.toolIcon}>
            <TokenIcon />
          </div>
          <div style={styles.toolInfo}>
            <div style={styles.toolTitle}>Add mUSDT to Wallet</div>
            <div style={styles.toolDesc}>Import token to MetaMask</div>
          </div>
          <button
            style={styles.toolBtn}
            onClick={onAddToken}
            onMouseOver={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              e.target.style.background = 'rgba(255, 255, 255, 0.08)';
            }}
            onMouseOut={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.target.style.background = 'rgba(255, 255, 255, 0.05)';
            }}
          >
            Add Token
          </button>
        </div>

        {/* PVM Badge */}
        <div style={styles.badge}>
          <CheckIcon />
          <span style={styles.badgeText}>
            Secured by <span style={styles.badgeMono}>PolkaVM</span>
          </span>
        </div>
      </div>
    </div>
  );
}
