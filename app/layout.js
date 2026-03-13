import { Syne, Inter } from 'next/font/google'
import './globals.css'

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
          backgroundColor: '#FCF8F4',
          color: '#212529',
          fontFamily: 'var(--font-inter), sans-serif',
        }}
      >
        {/* Header eliminado — el navbar vive dentro de cada página */}
        <main>{children}</main>
      </body>
    </html>
  )
}
