/**
 * SubscriptionsTable Component - KodaPay
 * Clean, professional table for subscription management
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
  count: {
    fontSize: '13px',
    color: '#737373',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '14px 24px',
    textAlign: 'left',
    fontSize: '11px',
    fontWeight: 600,
    color: '#737373',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '1px solid #E5E5E5',
    backgroundColor: '#FAFAFA',
  },
  td: {
    padding: '16px 24px',
    fontSize: '14px',
    color: '#121212',
    borderBottom: '1px solid #F5F5F5',
  },
  tdMono: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '13px',
  },
  statusActive: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    backgroundColor: '#ECFDF5',
    border: '1px solid #D1FAE5',
    fontSize: '12px',
    fontWeight: 500,
    color: '#16A34A',
  },
  statusInactive: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    backgroundColor: '#FEF2F2',
    border: '1px solid #FECACA',
    fontSize: '12px',
    fontWeight: 500,
    color: '#DC2626',
  },
  statusDue: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    backgroundColor: '#FFF7ED',
    border: '1px solid #FED7AA',
    fontSize: '12px',
    fontWeight: 500,
    color: '#EA580C',
  },
  statusDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
  },
  actions: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'flex-end',
  },
  btnExecute: {
    padding: '6px 12px',
    backgroundColor: '#E6007A',
    color: '#FFFFFF',
    border: 'none',
    fontSize: '12px',
    fontWeight: 500,
    cursor: 'pointer',
  },
  btnCancel: {
    padding: '6px 12px',
    backgroundColor: '#FFFFFF',
    color: '#DC2626',
    border: '1px solid #FECACA',
    fontSize: '12px',
    fontWeight: 500,
    cursor: 'pointer',
  },
  btnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  emptyState: {
    padding: '48px 24px',
    textAlign: 'center',
  },
  emptyTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#121212',
    marginBottom: '8px',
  },
  emptyText: {
    fontSize: '14px',
    color: '#737373',
  },
};

export default function SubscriptionsTable({ subscriptions = [], onCancel, onExecute, loading }) {
  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatNextPayment = (lastPayment, frequency) => {
    const next = (parseInt(lastPayment) + parseInt(frequency)) * 1000;
    const date = new Date(next);
    if (date.getTime() <= Date.now()) return 'Due Now';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const activeCount = subscriptions.filter(s => s.active).length;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Subscriptions</h3>
        <span style={styles.count}>{activeCount} Active / {subscriptions.length} Total</span>
      </div>

      {subscriptions.length === 0 ? (
        <div style={styles.emptyState}>
          <h4 style={styles.emptyTitle}>No Subscriptions Yet</h4>
          <p style={styles.emptyText}>Create your first subscription to get started with automated payments.</p>
        </div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Receiver</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Cycle</th>
              <th style={styles.th}>Next Payment</th>
              <th style={styles.th}>Status</th>
              <th style={{...styles.th, textAlign: 'right'}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((sub) => (
              <tr key={sub.id}>
                <td style={{...styles.td, ...styles.tdMono}}>#{sub.id}</td>
                <td style={{...styles.td, ...styles.tdMono}}>{formatAddress(sub.receiver)}</td>
                <td style={{...styles.td, ...styles.tdMono}}>{sub.amount} mUSDT</td>
                <td style={styles.td}>{Math.round(parseInt(sub.frequency) / 86400)} days</td>
                <td style={styles.td}>{formatNextPayment(sub.lastPayment, sub.frequency)}</td>
                <td style={styles.td}>
                  {!sub.active ? (
                    <span style={styles.statusInactive}>
                      <span style={{...styles.statusDot, backgroundColor: '#DC2626'}}></span>
                      Inactive
                    </span>
                  ) : sub.isDue ? (
                    <span style={styles.statusDue}>
                      <span style={{...styles.statusDot, backgroundColor: '#EA580C'}}></span>
                      Due
                    </span>
                  ) : (
                    <span style={styles.statusActive}>
                      <span style={{...styles.statusDot, backgroundColor: '#16A34A'}}></span>
                      Active
                    </span>
                  )}
                </td>
                <td style={{...styles.td, textAlign: 'right'}}>
                  <div style={styles.actions}>
                    {sub.active && sub.isDue && (
                      <button
                        style={{
                          ...styles.btnExecute,
                          ...(loading ? styles.btnDisabled : {}),
                        }}
                        onClick={() => onExecute(sub.id)}
                        disabled={loading}
                      >
                        Execute
                      </button>
                    )}
                    {sub.active && (
                      <button
                        style={{
                          ...styles.btnCancel,
                          ...(loading ? styles.btnDisabled : {}),
                        }}
                        onClick={() => onCancel(sub.id)}
                        disabled={loading}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
