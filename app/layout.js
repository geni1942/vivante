import { Syne, Inter } from 'next/font/google'
import Header from '@/components/Header'
import './globals.css'

// ── Fuentes del brandbook ──────────────────────
const syne = Syne({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-syne',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  variable: '--font-inter',
  display: 'swap',
})

// ── Metadata VIVANTE ──────────────────────────
export const metadata = {
  title: 'VIVANTE — Viaja más. Planifica menos.',
  description:
    'Diseñamos tu itinerario perfecto en minutos. Solo dinos tu presupuesto, días y lo que te apasiona.',
  openGraph: {
    title: 'VIVANTE — Viaja más. Planifica menos.',
    description: 'Tu itinerario personalizado en minutos.',
    siteName: 'VIVANTE',
    images: ['/images/vivante_logo.svg'],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${syne.variable} ${inter.variable}`}>
      <body
        style={{
          margin: 0,
          padding: 0,
          // Crema Suave #FCF8F4 — fondo de la app
          backgroundColor: '#FCF8F4',
          // Gris Carbón #212529 — texto base
          color: '#212529',
          fontFamily: 'var(--font-inter), sans-serif',
        }}
      >
        <Header />
        <main style={{ paddingTop: '68px' }}>
          {children}
        </main>
      </body>
    </html>
  )
}
