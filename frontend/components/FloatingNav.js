/**
 * FloatingNav Component - KodaPay 2077
 * Minimalist floating top-bar dock navigation
 */

import { useState } from 'react';

const styles = {
  nav: {
    position: 'fixed',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '6px',
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '50px',
    zIndex: 1000,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px 8px 12px',
    borderRight: '1px solid rgba(255, 255, 255, 0.08)',
    marginRight: '4px',
  },
  logoIcon: {
    width: '28px',
    height: '28px',
    background: 'linear-gradient(135deg, #E6007A 0%, #FF1A8C 100%)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 20px rgba(230, 0, 122, 0.4)',
  },
  logoText: {
    color: '#FFFFFF',
    fontWeight: 700,
    fontSize: '12px',
  },
  logoName: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#FFFFFF',
    letterSpacing: '-0.3px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 16px',
    borderRadius: '40px',
    fontSize: '13px',
    fontWeight: 500,
    color: 'rgba(255, 255, 255, 0.5)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: 'none',
    background: 'transparent',
  },
  navItemActive: {
    background: 'rgba(230, 0, 122, 0.15)',
    color: '#E6007A',
    boxShadow: '0 0 20px rgba(230, 0, 122, 0.2)',
  },
  navItemHover: {
    background: 'rgba(255, 255, 255, 0.05)',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  icon: {
    width: '16px',
    height: '16px',
    strokeWidth: '1.5',
  },
  statusSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    marginLeft: '4px',
    borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
  },
  statusDot: {
    width: '8px',
    height: '8px',
    backgroundColor: '#00FF88',
    borderRadius: '50%',
    boxShadow: '0 0 10px rgba(0, 255, 136, 0.5)',
    animation: 'heartbeat 2s ease-in-out infinite',
  },
  statusText: {
    fontSize: '10px',
    fontWeight: 500,
    color: 'rgba(255, 255, 255, 0.4)',
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
};

const DashboardIcon = () => (
  <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <rect x="3" y="3" width="7" height="9" rx="1"/>
    <rect x="14" y="3" width="7" height="5" rx="1"/>
    <rect x="14" y="12" width="7" height="9" rx="1"/>
    <rect x="3" y="16" width="7" height="5" rx="1"/>
  </svg>
);

const MerchantIcon = () => (
  <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
    <polyline points="9,22 9,12 15,12 15,22"/>
  </svg>
);

const NetworkIcon = () => (
  <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
  </svg>
);

export default function FloatingNav({ activeTab = 'dashboard', onTabChange }) {
  const [hoveredItem, setHoveredItem] = useState(null);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
    { id: 'merchant', label: 'Merchant', icon: MerchantIcon },
    { id: 'network', label: 'Network', icon: NetworkIcon },
  ];

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>
        <div style={styles.logoIcon}>
          <span style={styles.logoText}>K</span>
        </div>
        <span style={styles.logoName}>KodaPay</span>
      </div>

      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        const isHovered = hoveredItem === item.id;
        
        return (
          <button
            key={item.id}
            style={{
              ...styles.navItem,
              ...(isActive ? styles.navItemActive : {}),
              ...(isHovered && !isActive ? styles.navItemHover : {}),
            }}
            onClick={() => onTabChange && onTabChange(item.id)}
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <Icon />
            {item.label}
          </button>
        );
      })}

      <div style={styles.statusSection}>
        <div style={styles.statusDot} />
        <span style={styles.statusText}>PVM / RISC-V</span>
      </div>
    </nav>
  );
}
