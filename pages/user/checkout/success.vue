<script setup lang="ts">
definePageMeta({ breadcrumb: 'Success' })
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 py-16 text-center">
    <h1 class="text-2xl font-semibold">🎉 Order Confirmed</h1>
    <p class="mt-2 text-gray-600">Thank you! Your order has been placed successfully.</p>
    <div class="mt-6">
      <NuxtLink to="/products" class="rounded-md bg-indigo-600 px-4 py-2 font-semibold text-white">
        Continue Shopping
      </NuxtLink>
    </div>
  </div>
</template>
