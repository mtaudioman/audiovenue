import { auth } from '../../lib/auth'
import { getCart } from '../../modules/cart/services/cart.service'
import TopBar from './TopBar'
import HeaderMiddle from './HeaderMiddle'
import NavMenu from './NavMenu'

export default async function Navbar() {
  const session = await auth()
  let cartItemCount = 0

  if (session?.user?.id) {
    try {
      const cart = await getCart(session.user.id)
      cartItemCount = cart?.itemCount || 0
    } catch {
      cartItemCount = 0
    }
  }

  return (
    <header className="sticky top-0 z-30 shadow-md">
      <TopBar />
      <HeaderMiddle cartItemCount={cartItemCount} />
      <NavMenu />
    </header>
  )
}
