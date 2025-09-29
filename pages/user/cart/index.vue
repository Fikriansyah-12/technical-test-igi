<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCart } from '~/composables/useCart'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  layout: 'user',
  breadcrumb: 'Products',
  alias: ['/products']
})

const productStore = useProduct()
const cart = useCart()
const auth = useAuth()

const adding = ref<number | null>(null)

const userId = computed(() => auth.user?.id ?? null)

onMounted(async () => {
  await productStore.getProducts()
})

const route = useRoute()
const router = useRouter()
const q = computed(() => String(route.query.q || '').toLowerCase())
const list = computed(() =>
  !q.value
    ? productStore.products
    : productStore.products.filter(p =>
        [p.title, p.description, p.category].some(s =>
          String(s || '').toLowerCase().includes(q.value)
        )
      )
)

const add = async (id: number) => {
  if (!userId.value) {
    return navigateTo(`/auth/login?redirect=${encodeURIComponent(route.fullPath)}`)
  }
  adding.value = id
  try {
    await cart.addItem(userId.value, id, 1)
  } finally {
    adding.value = null
  }
}

const fmtIDR = (v: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v)
const checkout = () => router.push('/user/checkout')
</script>


<template>
  <div class="mx-auto max-w-5xl px-4 py-6 space-y-6">
    <h1 class="text-2xl font-semibold">Your Cart</h1>

    <!-- Loading -->
    <div v-if="cart.loading.detail" class="text-gray-600">Loading cart…</div>

    <!-- Error -->
    <div v-else-if="cart.error.detail" class="space-y-3">
      <p class="text-red-600">{{ cart.error.detail }}</p>
      <button class="rounded-md bg-indigo-600 px-3 py-1.5 text-white" @click="cart.getCart(cart.activeCartId!)">Retry</button>
    </div>

    <div v-else>
      <div v-if="cart.isEmpty" class="text-gray-500">
        Your cart is empty. <NuxtLink class="text-indigo-600" to="/user/product">Shop now</NuxtLink>
      </div>

      <div v-else class="space-y-4">
        <table class="min-w-full text-sm">
          <thead class="text-left text-gray-600">
            <tr>
              <th class="py-2">Product</th>
              <th class="py-2">Price</th>
              <th class="py-2">Qty</th>
              <th class="py-2">Subtotal</th>
              <th class="py-2"></th>
            </tr>
          </thead>
          <tbody class="divide-y">
            <tr v-for="line in cart.linesDetailed" :key="line.productId">
              <td class="py-3">
                <div class="flex items-center gap-3">
                  <img :src="line.product?.image" :alt="line.product?.title" class="h-12 w-12 object-contain" />
                  <div>
                    <div class="font-medium line-clamp-1">{{ line.product?.title || ('#'+line.productId) }}</div>
                    <div class="text-xs text-gray-500">{{ line.product?.category }}</div>
                  </div>
                </div>
              </td>
              <td class="py-3 font-medium">{{ fmtIDR(line.product?.price ?? 0) }}</td>
              <td class="py-3">
                <input
                  type="number"
                  min="1"
                  class="w-20 rounded-md border px-2 py-1"
                  :value="line.quantity"
                  :disabled="cart.loading.mutate"
                  @change="cart.setQuantity(line.productId, +($event.target as HTMLInputElement).value)"
                />
              </td>
              <td class="py-3 font-semibold">
                {{ fmtIDR((line.product?.price ?? 0) * line.quantity) }}
              </td>
              <td class="py-3 text-right">
                <button
                  class="rounded-md px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                  :disabled="cart.loading.mutate"
                  @click="cart.removeItem(line.productId)"
                >
                  Remove
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="flex items-center justify-between pt-4">
          <NuxtLink to="/user/product" class="text-sm text-indigo-600 hover:text-indigo-500">← Continue shopping</NuxtLink>
          <div class="text-right">
            <div class="text-sm text-gray-500">Subtotal</div>
            <div class="text-xl font-bold text-indigo-700">{{ fmtIDR(cart.subtotal) }}</div>
            <button
              class="mt-3 rounded-md bg-indigo-600 px-4 py-2 font-semibold text-white disabled:opacity-50"
              :disabled="cart.loading.mutate || cart.isEmpty"
              @click="checkout"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
