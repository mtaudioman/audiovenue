import { Geist } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'

const geist = Geist({ subsets: ['latin'] })

export const metadata = {
  title: 'Audio Venue | Bespoke Audio Visual Consultants',
  description: 'Premium audio visual equipment and bespoke consultancy services.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={geist.className}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
