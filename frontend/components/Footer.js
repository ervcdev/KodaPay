/**
 * Footer Component - KodaPay 2077
 * Minimal futuristic footer with PVM heartbeat
 */

const styles = {
  footer: {
    padding: '24px 48px',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  copyright: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.3)',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 14px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '8px',
    fontSize: '10px',
    fontWeight: 600,
    color: '#E6007A',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  badgeDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#E6007A',
    boxShadow: '0 0 8px rgba(230, 0, 122, 0.5)',
    animation: 'pulse 2s infinite',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '28px',
  },
  link: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.4)',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
};

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.left}>
        <span style={styles.copyright}>KodaPay 2024</span>
        <span style={styles.badge}>
          <span style={styles.badgeDot}></span>
          PVM-Native
        </span>
      </div>
      <div style={styles.links}>
        <a 
          href="https://polkadot.network" 
          target="_blank" 
          rel="noopener noreferrer"
          style={styles.link}
          onMouseOver={(e) => {
            e.target.style.color = '#E6007A';
            e.target.style.textShadow = '0 0 10px rgba(230, 0, 122, 0.5)';
          }}
          onMouseOut={(e) => {
            e.target.style.color = 'rgba(255, 255, 255, 0.4)';
            e.target.style.textShadow = 'none';
          }}
        >
          Polkadot
        </a>
        <a 
          href="#" 
          style={styles.link}
          onMouseOver={(e) => {
            e.target.style.color = '#E6007A';
            e.target.style.textShadow = '0 0 10px rgba(230, 0, 122, 0.5)';
          }}
          onMouseOut={(e) => {
            e.target.style.color = 'rgba(255, 255, 255, 0.4)';
            e.target.style.textShadow = 'none';
          }}
        >
          Documentation
        </a>
        <a 
          href="#" 
          style={styles.link}
          onMouseOver={(e) => {
            e.target.style.color = '#E6007A';
            e.target.style.textShadow = '0 0 10px rgba(230, 0, 122, 0.5)';
          }}
          onMouseOut={(e) => {
            e.target.style.color = 'rgba(255, 255, 255, 0.4)';
            e.target.style.textShadow = 'none';
          }}
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}
