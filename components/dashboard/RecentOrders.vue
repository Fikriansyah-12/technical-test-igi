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
  paid: 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-300',
  pending: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
  failed: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300',
  shipped: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300',
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
          <tr class="text-left text-gray-500 dark:text-gray-400">
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
