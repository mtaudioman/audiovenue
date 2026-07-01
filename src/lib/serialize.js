export function serializeProduct(product) {
  if (!product) return product
  return {
    ...product,
    price: product.price != null ? Number(product.price) : null,
    comparePrice: product.comparePrice != null ? Number(product.comparePrice) : null,
    weight: product.weight != null ? Number(product.weight) : null,
    variants: product.variants
      ? product.variants.map((v) => ({
          ...v,
          price: v.price != null ? Number(v.price) : null,
        }))
      : undefined,
  }
}

export function serializeProducts(products) {
  return products.map(serializeProduct)
}