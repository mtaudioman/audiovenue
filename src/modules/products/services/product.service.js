import {
  findAllProducts,
  findProductBySlug,
  findProductById,
  findFeaturedProducts,
  findRelatedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../repositories/product.repository'

export function getProducts(filters) {
  return findAllProducts(filters)
}

export function getProductBySlug(slug) {
  return findProductBySlug(slug)
}

export function getProductById(id) {
  return findProductById(id)
}

export function getFeaturedProducts(limit) {
  return findFeaturedProducts(limit)
}

export function getRelatedProducts(categoryId, excludeId, limit) {
  return findRelatedProducts(categoryId, excludeId, limit)
}

export function createNewProduct(data) {
  return createProduct(data)
}

export function updateExistingProduct(id, data) {
  return updateProduct(id, data)
}

export function deleteExistingProduct(id) {
  return deleteProduct(id)
}

export function calculateAverageRating(reviews) {
  if (!reviews || reviews.length === 0) return 0
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0)
  return Math.round((sum / reviews.length) * 10) / 10
}

export function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

export function isOnSale(product) {
  return product.comparePrice && product.comparePrice > product.price
}

export function getDiscountPercentage(product) {
  if (!isOnSale(product)) return 0
  return Math.round(
    ((product.comparePrice - product.price) / product.comparePrice) * 100
  )
}