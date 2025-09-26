<script setup lang="ts">
export type Order = {
  id: string
  customer: string
  date: string // ISO atau readable
  total: number
  status: 'paid' | 'pending' | 'failed' | 'shipped'
}

const props = defineProps<{ orders: Order[] }>()
const statusClass = (s: Order['status']) => ({
  paid: 'bg-green-500 text-white ',
  pending: 'bg-amber-500 text-white',
  failed: 'bg-red-500 text-white  ',
  shipped: 'bg-blue-500 text-white ',
}[s])
</script>

<template>
  <SectionCard>
    <template #title>Pesanan Terbaru</template>
    <template #actions>
      <NuxtLink to="/admin/pesanan" class="text-xs text-blue-600 hover:underline dark:text-blue-400">Lihat semua</NuxtLink>
    </template>

    <div class="overflow-x-auto">
      <table class="min-w-full text-sm">
        <thead>
          <tr class="text-left text-black">
            <th class="px-3 py-2 font-medium">Order ID</th>
            <th class="px-3 py-2 font-medium">Customer</th>
            <th class="px-3 py-2 font-medium">Tanggal</th>
            <th class="px-3 py-2 font-medium">Total</th>
            <th class="px-3 py-2 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="o in orders" :key="o.id" class="border-t border-gray-100 dark:border-neutral-800">
            <td class="px-3 py-2 font-mono text-[13px]">#{{ o.id }}</td>
            <td class="px-3 py-2">{{ o.customer }}</td>
            <td class="px-3 py-2">{{ o.date }}</td>
            <td class="px-3 py-2 font-medium">Rp {{ o.total.toLocaleString('id-ID') }}</td>
            <td class="px-3 py-2">
              <span class="rounded-full px-2 py-0.5 text-xs" :class="statusClass(o.status)">{{ o.status }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </SectionCard>
</template>
