/**
 * CreateSubscription Component - KodaPay
 * Clean form for creating recurring payments
 */

import { useState } from 'react';

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
    fontSize: '14px',
    fontWeight: 600,
    color: '#121212',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  body: {
    padding: '24px',
  },
  field: {
    marginBottom: '20px',
  },
  fieldLast: {
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
  input: {
    width: '100%',
    padding: '14px 16px',
    border: '1px solid #E5E5E5',
    backgroundColor: '#FFFFFF',
    fontSize: '14px',
    fontFamily: "'JetBrains Mono', monospace",
    color: '#121212',
  },
  inputGroup: {
    display: 'flex',
  },
  inputSuffix: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 16px',
    backgroundColor: '#FAFAFA',
    border: '1px solid #E5E5E5',
    borderLeft: 'none',
    fontSize: '12px',
    fontWeight: 600,
    color: '#737373',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  button: {
    width: '100%',
    padding: '14px 24px',
    backgroundColor: '#E6007A',
    color: '#FFFFFF',
    border: 'none',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '24px',
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
};

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

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Create Subscription</h3>
      </div>
      <div style={styles.body}>
        <div style={styles.field}>
          <label style={styles.label}>Receiver Address</label>
          <input
            type="text"
            style={styles.input}
            placeholder="0x..."
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
          />
        </div>
        
        <div style={styles.field}>
          <label style={styles.label}>Amount (mUSDT)</label>
          <div style={styles.inputGroup}>
            <input
              type="number"
              style={{...styles.input, flex: 1}}
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <span style={styles.inputSuffix}>mUSDT</span>
          </div>
        </div>
        
        <div style={styles.fieldLast}>
          <label style={styles.label}>Billing Cycle (Days)</label>
          <div style={styles.inputGroup}>
            <input
              type="number"
              style={{...styles.input, flex: 1}}
              placeholder="30"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
            />
            <span style={styles.inputSuffix}>Days</span>
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
            if (!loading && isFormValid) e.target.style.backgroundColor = '#C70066';
          }}
          onMouseOut={(e) => {
            if (!loading && isFormValid) e.target.style.backgroundColor = '#E6007A';
          }}
        >
          {loading ? 'Creating...' : 'Create Subscription'}
        </button>
      </div>
    </div>
  );
}
