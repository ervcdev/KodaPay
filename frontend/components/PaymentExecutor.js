/**
 * PaymentExecutor Component - KodaPay 2077
 * Launch-style Run Payment button with heavy glow
 */

const styles = {
  container: {
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '16px',
    padding: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '32px',
    marginBottom: '32px',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  iconWrapper: {
    width: '52px',
    height: '52px',
    background: 'rgba(230, 0, 122, 0.15)',
    border: '1px solid rgba(230, 0, 122, 0.3)',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 25px rgba(230, 0, 122, 0.2)',
  },
  icon: {
    width: '24px',
    height: '24px',
    color: '#E6007A',
    strokeWidth: '1.5',
    filter: 'drop-shadow(0 0 8px rgba(230, 0, 122, 0.5))',
  },
  info: {},
  title: {
    fontSize: '17px',
    fontWeight: 600,
    color: '#FFFFFF',
    marginBottom: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  subtitle: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.4)',
  },
  stats: {
    display: 'flex',
    alignItems: 'center',
    gap: '40px',
  },
  stat: {
    textAlign: 'center',
  },
  statValue: {
    fontSize: '28px',
    fontWeight: 600,
    color: '#FFFFFF',
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: '-0.5px',
    textShadow: '0 0 20px rgba(230, 0, 122, 0.3)',
  },
  statLabel: {
    fontSize: '10px',
    fontWeight: 500,
    color: 'rgba(255, 255, 255, 0.4)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginTop: '6px',
  },
  divider: {
    width: '1px',
    height: '48px',
    background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.1), transparent)',
  },
  launchButton: {
    padding: '18px 36px',
    background: 'linear-gradient(135deg, #E6007A 0%, #FF1A8C 100%)',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    whiteSpace: 'nowrap',
    boxShadow: '0 0 40px rgba(230, 0, 122, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
    transition: 'all 0.2s ease',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  buttonDisabled: {
    opacity: 0.3,
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  buttonIcon: {
    width: '18px',
    height: '18px',
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#FFFFFF',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '5px 10px',
    background: 'rgba(255, 149, 0, 0.15)',
    border: '1px solid rgba(255, 149, 0, 0.3)',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: 600,
    color: '#FF9500',
  },
};

const AutomationIcon = () => (
  <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
  </svg>
);

const RocketIcon = () => (
  <svg style={styles.buttonIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z"/>
    <path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"/>
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
  </svg>
);

export default function PaymentExecutor({ dueSubscriptions = 0, totalPending = '0.00', onRunSubscriptions, loading }) {
  const hasDue = dueSubscriptions > 0;

  return (
    <div style={styles.container}>
      <div style={styles.left}>
        <div style={styles.iconWrapper}>
          <AutomationIcon />
        </div>
        <div style={styles.info}>
          <div style={styles.title}>
            Payment Automation
            {hasDue && (
              <span style={styles.badge}>{dueSubscriptions} Due</span>
            )}
          </div>
          <div style={styles.subtitle}>Execute pending payments and earn 1% execution fee</div>
        </div>
      </div>

      <div style={styles.stats}>
        <div style={styles.stat}>
          <div style={styles.statValue}>{dueSubscriptions}</div>
          <div style={styles.statLabel}>Pending</div>
        </div>
        <div style={styles.divider}></div>
        <div style={styles.stat}>
          <div style={styles.statValue}>${totalPending}</div>
          <div style={styles.statLabel}>Total Due</div>
        </div>
      </div>

      <button
        style={{
          ...styles.launchButton,
          ...(loading || !hasDue ? styles.buttonDisabled : {}),
        }}
        onClick={onRunSubscriptions}
        disabled={loading || !hasDue}
        onMouseOver={(e) => {
          if (!loading && hasDue) {
            e.target.style.boxShadow = '0 0 60px rgba(230, 0, 122, 0.6), inset 0 1px 0 rgba(255,255,255,0.2)';
            e.target.style.transform = 'scale(1.02)';
          }
        }}
        onMouseOut={(e) => {
          if (!loading && hasDue) {
            e.target.style.boxShadow = '0 0 40px rgba(230, 0, 122, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)';
            e.target.style.transform = 'scale(1)';
          }
        }}
      >
        {loading ? (
          <div style={styles.spinner}></div>
        ) : (
          <RocketIcon />
        )}
        {loading ? 'Launching...' : 'Launch'}
      </button>
    </div>
  );
}
