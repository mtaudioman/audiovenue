import 'server-only'
import {
  findAllCategories,
  findCategoryById,
  findCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../repositories/category.repository'

export function getCategories() {
  return findAllCategories()
}

export function getCategoryById(id) {
  return findCategoryById(id)
}

export function getCategoryBySlug(slug) {
  return findCategoryBySlug(slug)
}

export function createNewCategory(data) {
  return createCategory(data)
}

export function updateExistingCategory(id, data) {
  return updateCategory(id, data)
}

export function deleteExistingCategory(id) {
  return deleteCategory(id)
}
