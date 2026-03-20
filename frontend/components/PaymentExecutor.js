/**
 * PaymentExecutor Component - KodaPay
 * Dedicated section for running subscription payments
 */

const styles = {
  container: {
    border: '1px solid #E5E5E5',
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: '20px 24px',
    borderBottom: '1px solid #E5E5E5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#121212',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  badge: {
    padding: '4px 8px',
    backgroundColor: '#FAFAFA',
    border: '1px solid #E5E5E5',
    fontSize: '10px',
    fontWeight: 600,
    color: '#16A34A',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  body: {
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '24px',
  },
  info: {
    flex: 1,
  },
  description: {
    fontSize: '14px',
    color: '#525252',
    marginBottom: '8px',
    lineHeight: 1.6,
  },
  incentive: {
    fontSize: '13px',
    color: '#737373',
  },
  incentiveHighlight: {
    color: '#E6007A',
    fontWeight: 600,
  },
  stats: {
    display: 'flex',
    gap: '24px',
    marginRight: '24px',
  },
  stat: {
    textAlign: 'center',
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#121212',
    fontFamily: "'JetBrains Mono', monospace",
  },
  statLabel: {
    fontSize: '11px',
    fontWeight: 500,
    color: '#737373',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginTop: '4px',
  },
  button: {
    padding: '16px 32px',
    backgroundColor: '#121212',
    color: '#FFFFFF',
    border: 'none',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
};

export default function PaymentExecutor({ 
  dueSubscriptions = 0, 
  totalPending = '0.00',
  onRunSubscriptions, 
  loading 
}) {
  const hasDue = dueSubscriptions > 0;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Payment Executor</h3>
        <span style={styles.badge}>1% Fee Incentive</span>
      </div>
      <div style={styles.body}>
        <div style={styles.info}>
          <p style={styles.description}>
            Execute due subscription payments and earn a 1% fee for each successful transaction.
          </p>
          <p style={styles.incentive}>
            Anyone can trigger payments. <span style={styles.incentiveHighlight}>Earn rewards</span> for helping the network.
          </p>
        </div>
        
        <div style={styles.stats}>
          <div style={styles.stat}>
            <div style={styles.statValue}>{dueSubscriptions}</div>
            <div style={styles.statLabel}>Due Now</div>
          </div>
          <div style={styles.stat}>
            <div style={styles.statValue}>{totalPending}</div>
            <div style={styles.statLabel}>mUSDT Pending</div>
          </div>
        </div>

        <button
          style={{
            ...styles.button,
            ...(loading || !hasDue ? styles.buttonDisabled : {}),
          }}
          onClick={onRunSubscriptions}
          disabled={loading || !hasDue}
          onMouseOver={(e) => {
            if (!loading && hasDue) e.target.style.backgroundColor = '#2a2a2a';
          }}
          onMouseOut={(e) => {
            if (!loading && hasDue) e.target.style.backgroundColor = '#121212';
          }}
        >
          {loading ? 'Executing...' : 'Run Subscriptions'}
        </button>
      </div>
    </div>
  );
}
