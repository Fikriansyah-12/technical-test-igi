<script setup lang="ts">
import BarChart from '~/components/dashboard/BarChart.vue'
import SectionCard from '~/components/dashboard/SectionCard.vue'
import RecentOrders from '~/components/dashboard/RecentOrders.vue'
import StatCard from '~/components/dashboard/StatCard.vue'
import Sparkline from '~/components/dashboard/Sparkline.vue'
import TopProducts from '~/components/dashboard/TopProducts.vue'
import { useDashboardData } from '@/composables/useDashboardData'

definePageMeta({ layout: 'admin' })
const { kpis, labelsDays, seriesOrders, seriesRevenue, recentOrders, topProducts } = useDashboardData()
</script>

<template>
  <div class="mx-auto max-w-7xl space-y-6 px-4 py-4">
    <!-- Breadcrumb (kalau layout belum render global) -->
    <Breadcrump variant="admin" :max="4" />

    <!-- Header + Filter ringan -->
     <div class="bg-gray-100 container rounded-lg p-2">
    <div class="flex flex-wrap items-center mb-2 justify-between gap-3">
      <h1 class="text-2xl font-semibold">Dashboard</h1>
      <div class="flex items-center gap-2">
        <select class="rounded-lg border p-2 py-2 text-sm">
          <option>7 hari</option>
          <option>30 hari</option>
          <option>12 bulan</option>
        </select>
        <NuxtLink to="/admin/produk/tambah"
          class="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700">
          + Produk
        </NuxtLink>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="grid gap-4  sm:grid-cols-2 lg:grid-cols-4">
      <StatCard v-for="(k, i) in kpis" :key="i" :title="k.title" :value="k.value" :delta="k.delta" :spark="k.spark" />
    </div>

    <!-- Charts -->
    <div class="grid gap-4 grid-cols-2">
        <SectionCard>
          <template #title>Pendapatan 7 Hari</template>
          <BarChart :labels="labelsDays" :values="seriesRevenue" :height="120">
            <template #title><h3 class="text-sm font-medium">Bar Chart</h3></template>
          </BarChart>
        </SectionCard>
      <div>
        <SectionCard>
          <template #title>Pesanan 7 Hari</template>
          <div class="pt-2 text-blue-600 bg-white ">
            <Sparkline :data="seriesOrders" :width="450" :height="120" />
          </div>
        </SectionCard>
      </div>
    </div>

    <!-- Tables / lists -->
    <div class="grid gap-4 lg:grid-cols-3">
      <div class="lg:col-span-2">
        <RecentOrders :orders="recentOrders" />
      </div>
      <div>
        <TopProducts :products="topProducts" />
      </div>
    </div>
    </div>
  </div>
</template>
