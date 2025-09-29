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
    // ⛔ belum login → arahkan ke login, lalu balik lagi ke halaman ini
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
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-6 space-y-6">
    <div v-if="productStore.loading" class="text-gray-600">Loading products…</div>

    <div v-else-if="productStore.error" class="space-y-3">
      <p class="text-red-600">{{ productStore.error }}</p>
      <button class="rounded-md bg-indigo-600 px-3 py-1.5 text-white" @click="productStore.getProducts()">
        Retry
      </button>
    </div>

    <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="p in list" :key="p.id" class="rounded-lg border bg-white p-3 hover:shadow">
        <NuxtLink :to="`/user/product/${p.id}`" class="block">
          <img :src="p.image" :alt="p.title" class="h-40 w-full object-contain" loading="lazy" />
          <h3 class="mt-3 line-clamp-1 font-semibold">{{ p.title }}</h3>
          <p class="mt-1 text-sm text-gray-500 line-clamp-2">{{ p.description }}</p>
        </NuxtLink>

        <div class="mt-3 flex items-center justify-between">
          <span class="font-semibold text-indigo-700">{{ fmtIDR(p.price) }}</span>
          <button
            class="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
            :disabled="!userId || cart.loading.mutate || adding === p.id"
            @click="add(p.id)"
          >
            <span v-if="!userId">Login to add</span>
            <span v-else-if="adding === p.id">Adding…</span>
            <span v-else>Add to Cart</span>
          </button>
        </div>
      </div>

      <div v-if="!list.length" class="col-span-full rounded-md border bg-white p-6 text-center text-sm text-gray-500">
        Tidak ada produk{{ q ? ` untuk "${q}"` : '' }}.
      </div>
    </div>
  </div>
</template>
