import Navbar from '@/src/components/layout/Navbar'
import Footer from '@/src/components/layout/Footer'
import CartSidebar from '@/src/modules/cart/components/CartSidebar'
import { auth } from '@/src/lib/auth'
import { getCart } from '@/src/modules/cart/services/cart.service'

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
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
    <>
      <Navbar />
      {children}
      <Footer />
      <CartSidebar cart={cart} />
    </>
  )
}
