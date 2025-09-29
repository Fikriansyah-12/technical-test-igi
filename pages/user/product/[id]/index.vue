<script setup lang="ts">
import { computed, ref } from "vue";

const productStore = useProduct();
const cart = useCart();

const route = useRoute();
const router = useRouter();

const pid = computed(() => Number(route.params.id));

definePageMeta({
  layout: "user",
  breadcrumb: (r: any) => `Detail #${r.params.id}`,
  alias: ["/products"],
});

// --- Fetch on mount & on id change (SSR friendly)
const { pending, error, refresh } = await useAsyncData(
  () => productStore.getProduct(pid.value),
  { watch: [pid] }
);

// --- Head meta
useHead(() => ({
  title: productStore.product
    ? `${productStore.product.title} • MyCommerce`
    : "Product Detail • MyCommerce",
  meta: productStore.product
    ? [
        {
          name: "description",
          content: productStore.product.description?.slice(0, 150),
        },
      ]
    : [],
}));

// --- Add to cart
const adding = ref(false);
const qty = ref(1);
const userId = 1; 

const addToCart = async () => {
  if (!productStore.product) return;
  adding.value = true;
  try {
    await cart.addItem(userId, productStore.product.id, qty.value);
  } finally {
    adding.value = false;
  }
};

// --- Helpers
const fmtIDR = (v: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(v);
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold">Product Detail</h1>
        <Breadcrump variant="user" :max="5" class="mt-1" />
      </div>

      <div class="flex items-center gap-2">
        <NuxtLink
          to="/user/product"
          class="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
        >
          ← Back to Products
        </NuxtLink>
        <NuxtLink
          to="/e-commerce/cart"
          class="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Cart ({{ cart.count }})
        </NuxtLink>
      </div>
    </div>

    <!-- Loading -->
    <div
      v-if="pending || productStore.loading"
      class="rounded-lg border bg-white p-6"
    >
      <div class="animate-pulse grid grid-cols-1 gap-6 md:grid-cols-2">
        <div class="h-72 w-full rounded-lg bg-gray-200" />
        <div class="space-y-3">
          <div class="h-6 w-3/4 rounded bg-gray-200" />
          <div class="h-4 w-1/2 rounded bg-gray-200" />
          <div class="h-20 w-full rounded bg-gray-200" />
          <div class="h-10 w-40 rounded bg-gray-200" />
        </div>
      </div>
    </div>

    <!-- Error -->
    <div
      v-else-if="error || productStore.error"
      class="rounded-lg border bg-white p-6"
    >
      <p class="mb-3 text-red-600">
        {{
          (productStore.error || (error as any)?.message) ??
          "Failed to load product."
        }}
      </p>
      <button
        class="rounded-md bg-indigo-600 px-3 py-1.5 text-white"
        @click="refresh()"
      >
        Retry
      </button>
    </div>

    <!-- Success -->
    <div
      v-else-if="productStore.product"
      class="rounded-lg border bg-white p-4 md:p-6"
    >
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <!-- Image -->
        <div class="flex items-center justify-center rounded-lg border p-4">
          <img
            :src="productStore.product.image"
            :alt="productStore.product.title"
            class="max-h-80 w-auto object-contain"
            loading="lazy"
          />
        </div>

        <!-- Info -->
        <div class="space-y-4">
          <h2 class="text-xl font-semibold">
            {{ productStore.product.title }}
          </h2>
          <p class="text-sm text-gray-600">
            {{ productStore.product.category }}
          </p>

          <div class="text-2xl font-bold text-indigo-700">
            {{ fmtIDR(productStore.product.price) }}
          </div>

          <p class="whitespace-pre-line text-gray-700">
            {{ productStore.product.description }}
          </p>

          <!-- Quantity + Add to Cart -->
          <div class="mt-4 flex flex-wrap items-center gap-3">
            <label class="flex items-center gap-2">
              <span class="text-sm text-gray-600">Qty</span>
              <input
                v-model.number="qty"
                type="number"
                min="1"
                class="w-20 rounded-md border px-2 py-1 text-sm"
              />
            </label>

            <button
              class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
              :disabled="adding"
              @click="addToCart"
            >
              <span v-if="adding">Adding…</span>
              <span v-else>Add to Cart</span>
            </button>
          </div>

          <!-- Quick nav: prev / next (opsional; berdasarkan id numerik) -->
          <div class="mt-6 flex items-center gap-2 text-sm">
            <NuxtLink
              :to="`/user/product/${Number(route.params.id) - 1}`"
              class="text-indigo-600 hover:text-indigo-500"
              v-if="Number(route.params.id) > 1"
            >
              ← Prev
            </NuxtLink>
            <span class="text-gray-300">|</span>
            <NuxtLink
              :to="`/user/product/${Number(route.params.id) + 1}`"
              class="text-indigo-600 hover:text-indigo-500"
            >
              Next →
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Guard (no data) -->
    <div v-else class="rounded-lg border bg-white p-6 text-gray-500">
      Product not found.
    </div>
  </div>
</template>
