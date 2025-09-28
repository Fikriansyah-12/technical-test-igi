// stores/product.ts
import { mapJsonToProduct, type Product } from '~/models/Product'
import type { TProduct } from '~/types/apiResponse'

type ProductInput = {
  title: string
  price: number
  description: string
  image: string
  category: string
}

export const useProduct = defineStore('product', {
  state: () => ({
    products: [] as Product[],
    product: null as Product | null,
    loading: false as boolean,
    error: null as string | null,
  }),
  actions: {
    async getProducts() {
      const api = useApi()
      this.loading = true
      this.error = null
      try {
        const { data } = await api.get<TProduct[]>({ url: '/products' })
        this.products = data.map(mapJsonToProduct)
        return this.products
      } catch (err: any) {
        api.handleError(err)
        this.error = err?.message ?? 'Failed to fetch products'
        return []
      } finally {
        this.loading = false
      }
    },

    async getProduct(id: number | string) {
      const api = useApi()
      this.loading = true
      this.error = null
      try {
        const { data } = await api.get<TProduct>({ url: `/products/${id}` })
        this.product = mapJsonToProduct(data)
        return this.product
      } catch (err: any) {
        api.handleError(err)
        this.error = err?.message ?? 'Failed to fetch product'
        return null
      } finally {
        this.loading = false
      }
    },

    async createProduct(input: ProductInput) {
      const api = useApi()
      this.loading = true
      this.error = null
      try {
        const { data } = await api.post<TProduct>({
          url: '/products',
          params: input,
        })
        const created = mapJsonToProduct(data)
        this.products.unshift(created)
        this.product = created
        return created
      } catch (err: any) {
        api.handleError(err)
        this.error = err?.message ?? 'Failed to create product'
        return null
      } finally {
        this.loading = false
      }
    },

    async updateProduct(id: number | string, input: Partial<ProductInput>) {
      const api = useApi()
      this.loading = true
      this.error = null
      try {
        const { data } = await api.put<TProduct>({
          url: `/products/${id}`,
          params: input,
        })
        const updated = mapJsonToProduct(data)

        const i = this.products.findIndex(p => p.id === updated.id)
        if (i !== -1) this.products[i] = updated

        if (this.product?.id === updated.id) this.product = updated

        return updated
      } catch (err: any) {
        api.handleError(err)
        this.error = err?.message ?? 'Failed to update product'
        return null
      } finally {
        this.loading = false
      }
    },

async deleteProduct(id: number | string) {
  const api = useApi()
  this.error = null
  this.loading = true
  try {
    await api.del({ url: `/products/${id}` }) 
    const idNum = Number(id)
    this.products = this.products.filter(product => product.id !== idNum)
    if (this.product?.id === idNum) this.product = null
    return true
  } catch (err: any) {
    api.handleError(err)
    this.error = err?.message ?? 'Failed to delete product'
    return false
  } finally {
    this.loading = false
  }
}

  },
})
