export default function HeroStats({ vaultBalance, totalSubscriptions, activeSubscriptions }) {
  const styles = {
    container: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '1px',
      backgroundColor: '#E5E5E5',
      border: '1px solid #E5E5E5',
      marginBottom: '32px',
    },
    stat: {
      backgroundColor: '#FFFFFF',
      padding: '32px',
    },
    label: {
      fontSize: '12px',
      fontWeight: 500,
      color: '#737373',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '8px',
    },
    value: {
      fontSize: '36px',
      fontWeight: 700,
      color: '#121212',
      letterSpacing: '-1px',
      fontFamily: "'JetBrains Mono', monospace",
    },
    unit: {
      fontSize: '16px',
      fontWeight: 500,
      color: '#737373',
      marginLeft: '8px',
    },
    subtext: {
      fontSize: '13px',
      color: '#737373',
      marginTop: '4px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.stat}>
        <div style={styles.label}>Vault Balance</div>
        <div style={styles.value}>
          {parseFloat(vaultBalance || 0).toFixed(2)}
          <span style={styles.unit}>mUSDT</span>
        </div>
        <div style={styles.subtext}>Available for subscriptions</div>
      </div>
      <div style={styles.stat}>
        <div style={styles.label}>Total Subscriptions</div>
        <div style={styles.value}>{totalSubscriptions || 0}</div>
        <div style={styles.subtext}>Created on this account</div>
      </div>
      <div style={styles.stat}>
        <div style={styles.label}>Active Subscriptions</div>
        <div style={styles.value}>
          {activeSubscriptions || 0}
          <span style={styles.unit}>/ {totalSubscriptions || 0}</span>
        </div>
        <div style={styles.subtext}>Currently running</div>
      </div>
    </div>
  );
}
