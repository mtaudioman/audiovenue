import { Geist } from 'next/font/google'
import './globals.css'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import CartSidebar from '../modules/cart/components/CartSidebar'
import { Toaster } from 'sonner'
import { auth } from '../lib/auth'
import { getCart } from '../modules/cart/services/cart.service'

const geist = Geist({ subsets: ['latin'] })

export const metadata = {
  title: 'Audio Venue | Bespoke Audio Visual Consultants',
  description: 'Premium audio visual equipment and bespoke consultancy services.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  let cart = null
  if (session?.user?.id) {
    try {
      cart = await getCart(session.user.id)
    } catch {
      cart = null
    }
  }

  return (
    <html lang="en">
      <body className={geist.className}>
        <Navbar />
        {children}
        <Footer />
        <CartSidebar cart={cart} />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
