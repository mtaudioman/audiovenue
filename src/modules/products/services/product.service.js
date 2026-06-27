import 'server-only'
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

export {
  formatPrice,
  calculateAverageRating,
  isOnSale,
  getDiscountPercentage,
} from '../utils/product.utils'
