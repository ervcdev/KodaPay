import { useState } from 'react';

export default function ManageFunds({ onDeposit, onWithdraw, isLoading }) {
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const styles = {
    container: {
      border: '1px solid #E5E5E5',
      backgroundColor: '#FFFFFF',
    },
    header: {
      padding: '20px 24px',
      borderBottom: '1px solid #E5E5E5',
    },
    title: {
      fontSize: '16px',
      fontWeight: 600,
      color: '#121212',
      marginBottom: '4px',
    },
    subtitle: {
      fontSize: '13px',
      color: '#737373',
    },
    body: {
      padding: '24px',
    },
    section: {
      marginBottom: '24px',
    },
    sectionLast: {
      marginBottom: 0,
    },
    label: {
      display: 'block',
      fontSize: '12px',
      fontWeight: 500,
      color: '#525252',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '8px',
    },
    inputGroup: {
      display: 'flex',
      gap: '8px',
    },
    input: {
      flex: 1,
      padding: '12px 16px',
      border: '1px solid #E5E5E5',
      backgroundColor: '#FFFFFF',
      fontSize: '14px',
      fontFamily: "'JetBrains Mono', monospace",
      color: '#121212',
    },
    inputSuffix: {
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      backgroundColor: '#FAFAFA',
      border: '1px solid #E5E5E5',
      borderLeft: 'none',
      fontSize: '13px',
      fontWeight: 500,
      color: '#737373',
    },
    button: {
      padding: '12px 24px',
      backgroundColor: '#121212',
      color: '#FFFFFF',
      border: 'none',
      fontSize: '14px',
      fontWeight: 500,
      cursor: 'pointer',
      minWidth: '120px',
    },
    buttonSecondary: {
      padding: '12px 24px',
      backgroundColor: '#FFFFFF',
      color: '#121212',
      border: '1px solid #E5E5E5',
      fontSize: '14px',
      fontWeight: 500,
      cursor: 'pointer',
      minWidth: '120px',
    },
    buttonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
    divider: {
      height: '1px',
      backgroundColor: '#E5E5E5',
      margin: '24px 0',
    },
  };

  const handleDeposit = () => {
    if (depositAmount && parseFloat(depositAmount) > 0) {
      onDeposit(depositAmount);
      setDepositAmount('');
    }
  };

  const handleWithdraw = () => {
    if (withdrawAmount && parseFloat(withdrawAmount) > 0) {
      onWithdraw(withdrawAmount);
      setWithdrawAmount('');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Manage Funds</h3>
        <p style={styles.subtitle}>Deposit or withdraw from your subscription vault</p>
      </div>
      <div style={styles.body}>
        <div style={styles.section}>
          <label style={styles.label}>Deposit Amount</label>
          <div style={styles.inputGroup}>
            <input
              type="number"
              style={styles.input}
              placeholder="0.00"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
            />
            <span style={styles.inputSuffix}>mUSDT</span>
            <button
              style={{
                ...styles.button,
                ...(isLoading || !depositAmount ? styles.buttonDisabled : {}),
              }}
              onClick={handleDeposit}
              disabled={isLoading || !depositAmount}
              onMouseOver={(e) => {
                if (!isLoading && depositAmount) e.target.style.backgroundColor = '#2a2a2a';
              }}
              onMouseOut={(e) => {
                if (!isLoading && depositAmount) e.target.style.backgroundColor = '#121212';
              }}
            >
              {isLoading ? 'Processing...' : 'Deposit'}
            </button>
          </div>
        </div>

        <div style={styles.divider} />

        <div style={styles.sectionLast}>
          <label style={styles.label}>Withdraw Amount</label>
          <div style={styles.inputGroup}>
            <input
              type="number"
              style={styles.input}
              placeholder="0.00"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
            />
            <span style={styles.inputSuffix}>mUSDT</span>
            <button
              style={{
                ...styles.buttonSecondary,
                ...(isLoading || !withdrawAmount ? styles.buttonDisabled : {}),
              }}
              onClick={handleWithdraw}
              disabled={isLoading || !withdrawAmount}
              onMouseOver={(e) => {
                if (!isLoading && withdrawAmount) e.target.style.backgroundColor = '#F5F5F5';
              }}
              onMouseOut={(e) => {
                if (!isLoading && withdrawAmount) e.target.style.backgroundColor = '#FFFFFF';
              }}
            >
              {isLoading ? 'Processing...' : 'Withdraw'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
