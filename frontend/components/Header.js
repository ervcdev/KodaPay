/**
 * Header Component
 * Displays project branding, network status, and wallet connection
 */

import { Wallet, Loader2 } from 'lucide-react'

const styles = {
  header: {
    borderBottom: '1px solid var(--border)',
    backgroundColor: 'var(--bg-card)',
    position: 'sticky',
    top: 0,
    zIndex: 50,
  },
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 24px',
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '64px',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logo: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    backgroundColor: 'var(--primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 700,
    fontSize: '18px',
  },
  title: {
    fontSize: '20px',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  network: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 12px',
    borderRadius: '100px',
    backgroundColor: 'var(--bg-input)',
    border: '1px solid var(--border)',
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: 'var(--success)',
  },
  networkText: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
  },
  btnPrimary: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    borderRadius: '8px',
    backgroundColor: 'var(--primary)',
    color: 'white',
    fontWeight: 500,
    fontSize: '14px',
    border: 'none',
    cursor: 'pointer',
  },
  btnSecondary: {
    padding: '8px 16px',
    borderRadius: '8px',
    backgroundColor: 'var(--bg-input)',
    color: 'var(--text-primary)',
    fontWeight: 500,
    fontSize: '13px',
    border: '1px solid var(--border)',
    cursor: 'pointer',
  },
  walletInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  address: {
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--text-primary)',
    fontFamily: 'monospace',
  },
  spinner: {
    animation: 'spin 1s linear infinite',
  }
}

export default function Header({
  account,
  chainId,
  loading,
  walletReady,
  onConnect,
  onDisconnect
}) {
  const shortenAddress = (address) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <div style={styles.inner}>
          <div style={styles.brand}>
            <div style={styles.logo}>S</div>
            <span style={styles.title}>SubScript</span>
          </div>

          <div style={styles.right}>
            <div style={styles.network}>
              <span style={styles.dot}></span>
              <span style={styles.networkText}>
                {chainId === 31337 ? 'Local Hardhat' : chainId === 420420421 ? 'Westend Revive' : 'Unknown Network'}
              </span>
            </div>

            {!account ? (
              <button
                onClick={onConnect}
                disabled={!walletReady || loading}
                style={{...styles.btnPrimary, opacity: (!walletReady || loading) ? 0.5 : 1}}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} style={styles.spinner} />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <Wallet size={16} />
                    <span>Connect Wallet</span>
                  </>
                )}
              </button>
            ) : (
              <div style={styles.walletInfo}>
                <span style={styles.address}>{shortenAddress(account)}</span>
                <button onClick={onDisconnect} style={styles.btnSecondary}>
                  Disconnect
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
