/**
 * Footer Component - KodaPay
 * Minimal footer with PVM-Native badge
 */

const styles = {
  footer: {
    padding: '24px 48px',
    borderTop: '1px solid #E5E5E5',
    backgroundColor: '#FAFAFA',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  copyright: {
    fontSize: '13px',
    color: '#737373',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E5E5',
    fontSize: '11px',
    fontWeight: 600,
    color: '#E6007A',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  badgeDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#E6007A',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  link: {
    fontSize: '13px',
    color: '#737373',
    textDecoration: 'none',
    cursor: 'pointer',
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
          onMouseOver={(e) => e.target.style.color = '#121212'}
          onMouseOut={(e) => e.target.style.color = '#737373'}
        >
          Polkadot
        </a>
        <a 
          href="#" 
          style={styles.link}
          onMouseOver={(e) => e.target.style.color = '#121212'}
          onMouseOut={(e) => e.target.style.color = '#737373'}
        >
          Documentation
        </a>
        <a 
          href="#" 
          style={styles.link}
          onMouseOver={(e) => e.target.style.color = '#121212'}
          onMouseOut={(e) => e.target.style.color = '#737373'}
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}
