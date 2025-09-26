<script setup lang="ts">
export type TopProduct = {
  id: string
  name: string
  sold: number
  revenue: number
  image?: string
}

defineProps<{ products: TopProduct[] }>()
</script>

<template>
  <SectionCard>
    <template #title>Produk Terlaris</template>
    <ul class="divide-y divide-gray-100 dark:divide-neutral-800">
      <li v-for="p in products" :key="p.id" class="flex items-center gap-3 py-3">
        <img :src="p.image || 'https://picsum.photos/seed/'+p.id+'/64/64'"
             alt="" class="h-10 w-10 rounded-lg object-cover" />
        <div class="min-w-0 flex-1">
          <p class="truncate font-medium">{{ p.name }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">{{ p.sold }} terjual</p>
        </div>
        <div class="text-right">
          <p class="text-sm font-semibold">Rp {{ p.revenue.toLocaleString('id-ID') }}</p>
        </div>
      </li>
    </ul>
  </SectionCard>
</template>
