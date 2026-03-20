/**
 * KodaPay App Configuration
 * Main Next.js app wrapper with global providers and styles.
 */

import Head from 'next/head'
import '../styles/globals.css'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>KodaPay - Web3 Subscription Protocol</title>
        <meta name="description" content="The decentralized subscription protocol built on Polkadot. Manage recurring payments on-chain." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
