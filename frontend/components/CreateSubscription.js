/**
 * CreateSubscription Component - KodaPay 2077
 * Glassmorphic form with laser-focus input effects
 */

const styles = {
  container: {
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '16px',
    height: '100%',
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
    background: 'rgba(230, 0, 122, 0.15)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: '18px',
    height: '18px',
    color: '#E6007A',
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
  },
  field: {
    marginBottom: '24px',
    position: 'relative',
  },
  label: {
    display: 'block',
    fontSize: '10px',
    fontWeight: 600,
    color: 'rgba(255, 255, 255, 0.4)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '10px',
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    background: 'rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '10px',
    fontSize: '14px',
    fontFamily: "'JetBrains Mono', monospace",
    color: '#FFFFFF',
    transition: 'all 0.2s ease',
  },
  laserLine: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    width: 0,
    height: '2px',
    background: 'linear-gradient(90deg, transparent, #E6007A, transparent)',
    boxShadow: '0 0 10px #E6007A',
    transition: 'all 0.3s ease',
    transform: 'translateX(-50%)',
  },
  inputGroup: {
    display: 'flex',
  },
  inputSuffix: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 16px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderLeft: 'none',
    borderRadius: '0 10px 10px 0',
    fontSize: '10px',
    fontWeight: 600,
    color: 'rgba(255, 255, 255, 0.4)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  inputWithSuffix: {
    borderRadius: '10px 0 0 10px',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  button: {
    width: '100%',
    padding: '16px 24px',
    background: 'linear-gradient(135deg, #E6007A 0%, #FF1A8C 100%)',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    boxShadow: '0 0 30px rgba(230, 0, 122, 0.3)',
    transition: 'all 0.2s ease',
  },
  buttonDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  spinner: {
    width: '14px',
    height: '14px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#FFFFFF',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
};

const PlusIcon = () => (
  <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="16"/>
    <line x1="8" y1="12" x2="16" y2="12"/>
  </svg>
);

export default function CreateSubscription({
  receiver,
  setReceiver,
  amount,
  setAmount,
  frequency,
  setFrequency,
  onCreateSubscription,
  loading
}) {
  const isFormValid = receiver && amount && frequency && parseFloat(amount) > 0 && parseInt(frequency) > 0;

  const handleInputFocus = (e) => {
    e.target.style.borderColor = 'rgba(230, 0, 122, 0.5)';
    e.target.style.boxShadow = '0 0 20px rgba(230, 0, 122, 0.15)';
    const laser = e.target.parentElement.querySelector('.laser-line');
    if (laser) {
      laser.style.width = '100%';
      laser.style.left = '0';
      laser.style.transform = 'translateX(0)';
    }
  };

  const handleInputBlur = (e) => {
    e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)';
    e.target.style.boxShadow = 'none';
    const laser = e.target.parentElement.querySelector('.laser-line');
    if (laser) {
      laser.style.width = '0';
      laser.style.left = '50%';
      laser.style.transform = 'translateX(-50%)';
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.titleRow}>
          <div style={styles.iconWrapper}>
            <PlusIcon />
          </div>
          <span style={styles.title}>Create Subscription</span>
        </div>
        <div style={styles.subtitle}>Set up automated recurring payments</div>
      </div>
      
      <div style={styles.body}>
        <div style={styles.field}>
          <label style={styles.label}>Recipient Address</label>
          <div style={styles.inputWrapper}>
            <input
              type="text"
              style={styles.input}
              placeholder="0x..."
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
            <div className="laser-line" style={styles.laserLine}></div>
          </div>
        </div>
        
        <div style={styles.row}>
          <div style={styles.field}>
            <label style={styles.label}>Amount</label>
            <div style={{...styles.inputWrapper, ...styles.inputGroup}}>
              <input
                type="number"
                style={{...styles.input, ...styles.inputWithSuffix, flex: 1}}
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
              <span style={styles.inputSuffix}>mUSDT</span>
            </div>
          </div>
          
          <div style={styles.field}>
            <label style={styles.label}>Billing Cycle</label>
            <div style={{...styles.inputWrapper, ...styles.inputGroup}}>
              <input
                type="number"
                style={{...styles.input, ...styles.inputWithSuffix, flex: 1}}
                placeholder="30"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
              <span style={styles.inputSuffix}>Days</span>
            </div>
          </div>
        </div>

        <button
          style={{
            ...styles.button,
            ...(loading || !isFormValid ? styles.buttonDisabled : {}),
          }}
          onClick={onCreateSubscription}
          disabled={loading || !isFormValid}
          onMouseOver={(e) => {
            if (!loading && isFormValid) e.target.style.boxShadow = '0 0 50px rgba(230, 0, 122, 0.5)';
          }}
          onMouseOut={(e) => {
            if (!loading && isFormValid) e.target.style.boxShadow = '0 0 30px rgba(230, 0, 122, 0.3)';
          }}
        >
          {loading && <div style={styles.spinner}></div>}
          {loading ? 'Creating...' : 'Create Subscription'}
        </button>
      </div>
    </div>
  );
}
