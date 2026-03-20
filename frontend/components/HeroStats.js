/**
 * HeroStats Component - KodaPay 2077
 * Central floating vault card with digital readout
 */

const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.5fr 1fr',
    gap: '20px',
    marginBottom: '32px',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '16px',
    padding: '28px',
    position: 'relative',
    overflow: 'hidden',
  },
  vaultCard: {
    background: 'linear-gradient(135deg, rgba(230, 0, 122, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)',
    border: '1px solid',
    borderImage: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(230, 0, 122, 0.3)) 1',
    animation: 'glow-pulse 3s ease-in-out infinite',
  },
  iconWrapper: {
    width: '40px',
    height: '40px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  iconWrapperAccent: {
    background: 'rgba(230, 0, 122, 0.15)',
    borderColor: 'rgba(230, 0, 122, 0.3)',
    boxShadow: '0 0 20px rgba(230, 0, 122, 0.2)',
  },
  icon: {
    width: '18px',
    height: '18px',
    color: 'rgba(255, 255, 255, 0.5)',
    strokeWidth: '1.5',
  },
  iconAccent: {
    color: '#E6007A',
    filter: 'drop-shadow(0 0 8px rgba(230, 0, 122, 0.5))',
  },
  label: {
    fontSize: '11px',
    fontWeight: 500,
    color: 'rgba(255, 255, 255, 0.4)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '8px',
  },
  valueRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
  },
  value: {
    fontSize: '36px',
    fontWeight: 600,
    color: '#FFFFFF',
    letterSpacing: '-1px',
    fontFamily: "'JetBrains Mono', monospace",
    textShadow: '0 0 30px rgba(230, 0, 122, 0.3)',
  },
  unit: {
    fontSize: '14px',
    fontWeight: 500,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  subtext: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.3)',
    marginTop: '12px',
  },
  quickActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
  },
  actionBtn: {
    flex: 1,
    padding: '10px 16px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: 500,
    color: 'rgba(255, 255, 255, 0.7)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  vaultActive: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '16px',
  },
  vaultDot: {
    width: '8px',
    height: '8px',
    backgroundColor: '#00FF88',
    borderRadius: '50%',
    boxShadow: '0 0 10px rgba(0, 255, 136, 0.5)',
    animation: 'pulse 2s infinite',
  },
  vaultStatus: {
    fontSize: '11px',
    fontWeight: 500,
    color: '#00FF88',
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 10px',
    background: 'rgba(230, 0, 122, 0.15)',
    borderRadius: '6px',
    fontSize: '10px',
    fontWeight: 600,
    color: '#E6007A',
    marginTop: '12px',
  },
};

const ChartIcon = () => (
  <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M18 20V10M12 20V4M6 20v-6"/>
  </svg>
);

const UsersIcon = () => (
  <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
  </svg>
);

const VaultIcon = () => (
  <svg style={{...styles.icon, ...styles.iconAccent}} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <circle cx="12" cy="12" r="3"/>
    <path d="M6 8h.01M18 8h.01"/>
  </svg>
);

export default function HeroStats({ 
  vaultBalance, 
  totalSubscriptions, 
  activeSubscriptions,
  onDeposit,
  onWithdraw,
}) {
  const mrr = (parseFloat(vaultBalance || 0) * 0.12).toFixed(2);

  return (
    <div style={styles.container}>
      {/* MRR Card */}
      <div style={styles.card}>
        <div style={styles.iconWrapper}>
          <ChartIcon />
        </div>
        <div style={styles.label}>Monthly Recurring</div>
        <div style={styles.valueRow}>
          <span style={styles.value}>${mrr}</span>
        </div>
        <div style={styles.subtext}>Estimated from active subscriptions</div>
      </div>

      {/* Vault Balance - Central Featured */}
      <div style={{...styles.card, ...styles.vaultCard}}>
        <div style={{...styles.iconWrapper, ...styles.iconWrapperAccent}}>
          <VaultIcon />
        </div>
        <div style={styles.label}>Vault Balance</div>
        <div style={styles.valueRow}>
          <span style={styles.value}>{parseFloat(vaultBalance || 0).toFixed(2)}</span>
          <span style={styles.unit}>mUSDT</span>
        </div>
        <div style={styles.vaultActive}>
          <span style={styles.vaultDot}></span>
          <span style={styles.vaultStatus}>Vault Active</span>
        </div>
        <div style={styles.quickActions}>
          <button 
            style={styles.actionBtn}
            onClick={onDeposit}
            onMouseOver={(e) => {
              e.target.style.borderColor = 'rgba(230, 0, 122, 0.3)';
              e.target.style.background = 'rgba(230, 0, 122, 0.1)';
            }}
            onMouseOut={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.target.style.background = 'rgba(255, 255, 255, 0.05)';
            }}
          >
            Deposit
          </button>
          <button 
            style={styles.actionBtn}
            onClick={onWithdraw}
            onMouseOver={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              e.target.style.background = 'rgba(255, 255, 255, 0.08)';
            }}
            onMouseOut={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.target.style.background = 'rgba(255, 255, 255, 0.05)';
            }}
          >
            Withdraw
          </button>
        </div>
      </div>

      {/* Active Subscribers */}
      <div style={styles.card}>
        <div style={styles.iconWrapper}>
          <UsersIcon />
        </div>
        <div style={styles.label}>Active Subscribers</div>
        <div style={styles.valueRow}>
          <span style={styles.value}>{activeSubscriptions || 0}</span>
          <span style={styles.unit}>/ {totalSubscriptions || 0}</span>
        </div>
        <div style={styles.badge}>
          {activeSubscriptions > 0 ? 'Active' : 'None'}
        </div>
      </div>
    </div>
  );
}
