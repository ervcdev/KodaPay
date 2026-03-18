/**
 * ¿Qué hace este archivo?
 * Configuración principal de Next.js que envuelve toda la aplicación.
 * Inicializa el contexto de wallet y providers globales.
 * 
 * ¿Por qué lo diseñamos así para PVM?
 * PVM necesita integración específica con Polkadot-API. Este archivo
 * centraliza la configuración de conexión y estado global.
 * 
 * Documentación para estudiar este concepto:
 * - Next.js App Component: https://nextjs.org/docs/advanced-features/custom-app
 * - Polkadot-JS API: https://polkadot.js.org/docs/api
 */

import '../styles/globals.css'

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
