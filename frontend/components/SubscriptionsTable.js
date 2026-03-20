/**
 * SubscriptionsTable Component - KodaPay 2077
 * Digital Strips with micro-charts instead of table
 */

import { useState } from 'react';

const styles = {
  container: {
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '16px',
    overflow: 'hidden',
  },
  header: {
    padding: '24px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  iconWrapper: {
    width: '36px',
    height: '36px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: '18px',
    height: '18px',
    color: 'rgba(255, 255, 255, 0.5)',
    strokeWidth: '1.5',
  },
  title: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#FFFFFF',
  },
  count: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.4)',
    fontFamily: "'JetBrains Mono', monospace",
  },
  body: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  strip: {
    background: 'rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    padding: '20px',
    display: 'grid',
    gridTemplateColumns: '60px 1fr 120px 100px auto',
    alignItems: 'center',
    gap: '20px',
    transition: 'all 0.2s ease',
  },
  stripHover: {
    borderColor: 'rgba(230, 0, 122, 0.2)',
    background: 'rgba(230, 0, 122, 0.03)',
  },
  idBadge: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '13px',
    fontWeight: 600,
    color: '#E6007A',
    textShadow: '0 0 10px rgba(230, 0, 122, 0.5)',
  },
  recipientSection: {},
  recipientLabel: {
    fontSize: '10px',
    fontWeight: 500,
    color: 'rgba(255, 255, 255, 0.3)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '4px',
  },
  recipientAddress: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  address: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '13px',
    color: '#FFFFFF',
    textShadow: '0 0 10px rgba(230, 0, 122, 0.2)',
  },
  copyBtn: {
    padding: '4px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: 'rgba(255, 255, 255, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    transition: 'all 0.15s ease',
  },
  copyIcon: {
    width: '14px',
    height: '14px',
  },
  amountSection: {
    textAlign: 'center',
  },
  amountValue: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '16px',
    fontWeight: 600,
    color: '#FFFFFF',
    textShadow: '0 0 15px rgba(230, 0, 122, 0.3)',
  },
  amountUnit: {
    fontSize: '10px',
    color: 'rgba(255, 255, 255, 0.4)',
    marginLeft: '4px',
  },
  microChart: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '2px',
    height: '24px',
    marginTop: '6px',
    justifyContent: 'center',
  },
  chartBar: {
    width: '4px',
    background: 'linear-gradient(180deg, #E6007A 0%, rgba(230, 0, 122, 0.3) 100%)',
    borderRadius: '2px',
    boxShadow: '0 0 4px rgba(230, 0, 122, 0.3)',
  },
  statusSection: {
    display: 'flex',
    justifyContent: 'center',
  },
  statusActive: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    background: 'rgba(230, 0, 122, 0.15)',
    border: '1px solid rgba(230, 0, 122, 0.3)',
    borderRadius: '8px',
    fontSize: '11px',
    fontWeight: 600,
    color: '#E6007A',
  },
  statusInactive: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    fontSize: '11px',
    fontWeight: 600,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  statusDue: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    background: 'rgba(255, 149, 0, 0.15)',
    border: '1px solid rgba(255, 149, 0, 0.3)',
    borderRadius: '8px',
    fontSize: '11px',
    fontWeight: 600,
    color: '#FF9500',
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
    padding: '8px 14px',
    background: 'linear-gradient(135deg, #E6007A 0%, #FF1A8C 100%)',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: '0 0 15px rgba(230, 0, 122, 0.3)',
    transition: 'all 0.2s ease',
  },
  btnCancel: {
    padding: '8px 14px',
    background: 'transparent',
    color: '#FF3B30',
    border: '1px solid rgba(255, 59, 48, 0.3)',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  btnDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
  emptyState: {
    padding: '80px 24px',
    textAlign: 'center',
  },
  emptyIcon: {
    width: '56px',
    height: '56px',
    color: 'rgba(255, 255, 255, 0.15)',
    marginBottom: '20px',
  },
  emptyTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#FFFFFF',
    marginBottom: '8px',
  },
  emptyText: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.4)',
    maxWidth: '300px',
    margin: '0 auto',
  },
};

const TableIcon = () => (
  <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <line x1="3" y1="9" x2="21" y2="9"/>
    <line x1="9" y1="21" x2="9" y2="9"/>
  </svg>
);

const CopyIcon = () => (
  <svg style={styles.copyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="9" y="9" width="13" height="13" rx="2"/>
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
  </svg>
);

const EmptyIcon = () => (
  <svg style={styles.emptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
    <rect x="9" y="3" width="6" height="4" rx="1"/>
    <line x1="9" y1="12" x2="15" y2="12"/>
    <line x1="9" y1="16" x2="13" y2="16"/>
  </svg>
);

// Generate random micro-chart bars
const generateBars = () => {
  return [0.4, 0.7, 0.5, 0.9, 0.6, 0.8, 1.0, 0.7].map((h, i) => (
    <div key={i} style={{...styles.chartBar, height: `${h * 24}px`}} />
  ));
};

export default function SubscriptionsTable({ subscriptions = [], onCancel, onExecute, loading }) {
  const [hoveredRow, setHoveredRow] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const activeCount = subscriptions.filter(s => s.active).length;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.titleRow}>
          <div style={styles.iconWrapper}>
            <TableIcon />
          </div>
          <span style={styles.title}>Active Subscriptions</span>
        </div>
        <span style={styles.count}>{activeCount} active / {subscriptions.length} total</span>
      </div>

      {subscriptions.length === 0 ? (
        <div style={styles.emptyState}>
          <EmptyIcon />
          <h4 style={styles.emptyTitle}>No Subscriptions Yet</h4>
          <p style={styles.emptyText}>
            Create your first subscription to automate recurring payments on-chain.
          </p>
        </div>
      ) : (
        <div style={styles.body}>
          {subscriptions.map((sub) => (
            <div 
              key={sub.id}
              style={{
                ...styles.strip,
                ...(hoveredRow === sub.id ? styles.stripHover : {}),
              }}
              onMouseEnter={() => setHoveredRow(sub.id)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              <div style={styles.idBadge}>#{sub.id}</div>
              
              <div style={styles.recipientSection}>
                <div style={styles.recipientLabel}>Recipient</div>
                <div style={styles.recipientAddress}>
                  <span style={styles.address}>{formatAddress(sub.receiver)}</span>
                  <button
                    style={styles.copyBtn}
                    onClick={() => copyToClipboard(sub.receiver, sub.id)}
                    title="Copy address"
                    onMouseOver={(e) => e.target.style.color = '#E6007A'}
                    onMouseOut={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.3)'}
                  >
                    <CopyIcon />
                  </button>
                </div>
              </div>

              <div style={styles.amountSection}>
                <div>
                  <span style={styles.amountValue}>{sub.amount}</span>
                  <span style={styles.amountUnit}>mUSDT</span>
                </div>
                <div style={styles.microChart}>
                  {generateBars()}
                </div>
              </div>

              <div style={styles.statusSection}>
                {!sub.active ? (
                  <span style={styles.statusInactive}>
                    <span style={{...styles.statusDot, backgroundColor: 'rgba(255,255,255,0.4)'}}></span>
                    Inactive
                  </span>
                ) : sub.isDue ? (
                  <span style={styles.statusDue}>
                    <span style={{...styles.statusDot, backgroundColor: '#FF9500', boxShadow: '0 0 6px rgba(255, 149, 0, 0.5)'}}></span>
                    Due
                  </span>
                ) : (
                  <span style={styles.statusActive}>
                    <span style={{...styles.statusDot, backgroundColor: '#E6007A', boxShadow: '0 0 6px rgba(230, 0, 122, 0.5)'}}></span>
                    Active
                  </span>
                )}
              </div>

              <div style={styles.actions}>
                {sub.active && sub.isDue && (
                  <button
                    style={{
                      ...styles.btnExecute,
                      ...(loading ? styles.btnDisabled : {}),
                    }}
                    onClick={() => onExecute(sub.id)}
                    disabled={loading}
                    onMouseOver={(e) => {
                      if (!loading) e.target.style.boxShadow = '0 0 25px rgba(230, 0, 122, 0.5)';
                    }}
                    onMouseOut={(e) => {
                      if (!loading) e.target.style.boxShadow = '0 0 15px rgba(230, 0, 122, 0.3)';
                    }}
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
                    onMouseOver={(e) => {
                      if (!loading) {
                        e.target.style.background = 'rgba(255, 59, 48, 0.1)';
                        e.target.style.borderColor = 'rgba(255, 59, 48, 0.5)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!loading) {
                        e.target.style.background = 'transparent';
                        e.target.style.borderColor = 'rgba(255, 59, 48, 0.3)';
                      }
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
