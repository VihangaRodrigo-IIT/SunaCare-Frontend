import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'One Tap - Animal Emergency Report',
  description: 'One-tap animal emergency reporting system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}
