export function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

export function calculateAverageRating(reviews) {
  if (!reviews || reviews.length === 0) return 0
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0)
  return Math.round((sum / reviews.length) * 10) / 10
}

export function isOnSale(product) {
  return product.comparePrice && Number(product.comparePrice) > Number(product.price)
}

export function getDiscountPercentage(product) {
  if (!isOnSale(product)) return 0
  return Math.round(
    ((Number(product.comparePrice) - Number(product.price)) / Number(product.comparePrice)) * 100
  )
}