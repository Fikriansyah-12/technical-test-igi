<script setup lang="ts">
import { onMounted, ref } from 'vue'

definePageMeta({ breadcrumb: 'Checkout', layout: 'user' })

const cart = useCart()
const router = useRouter()
const placing = ref(false)
const userId = 1 

onMounted(async () => {
  await cart.ensureCart(userId)
  await cart.hydrateCartProducts()
})

const fmtIDR = (v: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v)

const placeOrder = async () => {
  placing.value = true
  try {
    await cart.clearCart()
    router.push('/user/checkout/success')
  } finally {
    placing.value = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-5xl px-4 py-6 space-y-6">
    <NuxtLink to="/cart" class="text-sm text-indigo-600 hover:text-indigo-500">← Back to cart</NuxtLink>
    <h1 class="text-2xl font-semibold">Checkout</h1>

    <div v-if="cart.isEmpty" class="text-gray-500">
      Your cart is empty. <NuxtLink class="text-indigo-600" to="/user/product">Shop now</NuxtLink>
    </div>

    <div v-else class="space-y-4">
      <div class="rounded-lg border bg-white p-4">
        <h2 class="mb-3 font-semibold">Order Summary</h2>
        <ul class="space-y-2">
          <li v-for="line in cart.linesDetailed" :key="line.productId" class="flex justify-between">
            <span>{{ line.product?.title }} × {{ line.quantity }}</span>
            <span class="font-medium">
              {{ fmtIDR((line.product?.price ?? 0) * line.quantity) }}
            </span>
          </li>
        </ul>
        <div class="mt-4 flex justify-between border-t pt-3">
          <span class="font-medium">Total</span>
          <span class="text-xl font-bold text-indigo-700">{{ fmtIDR(cart.subtotal) }}</span>
        </div>
      </div>

      <button
        class="rounded-md bg-indigo-600 px-4 py-2 font-semibold text-white disabled:opacity-50"
        :disabled="placing || cart.isEmpty"
        @click="placeOrder"
      >
        <span v-if="placing">Placing order…</span>
        <span v-else>Confirm Order</span>
      </button>
    </div>
  </div>
</template>
