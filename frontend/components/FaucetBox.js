export default function FaucetBox({ onMint, isLoading }) {
  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 24px',
      backgroundColor: '#FAFAFA',
      border: '1px solid #E5E5E5',
      marginBottom: '32px',
    },
    left: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    badge: {
      padding: '4px 8px',
      backgroundColor: '#FFFFFF',
      border: '1px solid #E5E5E5',
      fontSize: '10px',
      fontWeight: 600,
      color: '#737373',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    text: {
      fontSize: '14px',
      color: '#525252',
    },
    strong: {
      fontWeight: 600,
      color: '#121212',
    },
    button: {
      padding: '8px 16px',
      backgroundColor: '#FFFFFF',
      color: '#121212',
      border: '1px solid #E5E5E5',
      fontSize: '13px',
      fontWeight: 500,
      cursor: 'pointer',
    },
    buttonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.left}>
        <span style={styles.badge}>Testnet</span>
        <span style={styles.text}>
          Need test tokens? Get <span style={styles.strong}>100 mUSDT</span> from the faucet.
        </span>
      </div>
      <button
        style={{
          ...styles.button,
          ...(isLoading ? styles.buttonDisabled : {}),
        }}
        onClick={onMint}
        disabled={isLoading}
        onMouseOver={(e) => {
          if (!isLoading) e.target.style.backgroundColor = '#F5F5F5';
        }}
        onMouseOut={(e) => {
          if (!isLoading) e.target.style.backgroundColor = '#FFFFFF';
        }}
      >
        {isLoading ? 'Minting...' : 'Get Test Tokens'}
      </button>
    </div>
  );
}
