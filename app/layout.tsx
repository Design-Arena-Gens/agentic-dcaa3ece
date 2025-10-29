import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'IP Info & VPN Detector',
  description: 'Real-time IP information and VPN provider detection',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
