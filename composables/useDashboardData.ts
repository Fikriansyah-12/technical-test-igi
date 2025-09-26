// composables/useDashboardData.ts
import { computed, ref } from 'vue'

export function useDashboardData() {
  // KPI
  const revenue = ref(128_450_000)
  const orders = ref(742)
  const customers = ref(389)
  const refundRate = ref(1.2) // %

  // Series (7 hari)
  const seriesRevenue = ref([12, 18, 15, 20, 25, 22, 28])
  const seriesOrders = ref([80, 95, 90, 110, 130, 120, 117])
  const labelsDays = ref(['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'])

  const kpis = computed(() => ([
    { title: 'Pendapatan', value: `Rp ${revenue.value.toLocaleString('id-ID')}`, delta: 6.4, spark: seriesRevenue.value },
    { title: 'Pesanan', value: orders.value, delta: 2.1, spark: seriesOrders.value },
    { title: 'Pelanggan', value: customers.value, delta: 1.8, spark: [5,7,6,8,9,9,10] },
    { title: 'Refund Rate', value: `${refundRate.value}%`, delta: -0.4, spark: [2.1,1.9,1.8,1.7,1.6,1.5,1.2] },
  ]))

  // Pesanan terbaru (mock)
  const recentOrders = ref([
    { id: 'INV-1042', customer: 'Rizky Putra', date: '24 Sep 2025', total: 425000, status: 'paid' },
    { id: 'INV-1041', customer: 'Siti Aisyah', date: '24 Sep 2025', total: 229000, status: 'shipped' },
    { id: 'INV-1040', customer: 'Budi Santoso', date: '23 Sep 2025', total: 78000, status: 'pending' },
    { id: 'INV-1039', customer: 'Dewi Lestari', date: '23 Sep 2025', total: 152000, status: 'paid' },
  ])

  // Produk terlaris (mock)
  const topProducts = ref([
    { id: 'p-1', name: 'Kopi Gayo 250g', sold: 142, revenue: 7110000 },
    { id: 'p-2', name: 'Teh Melati Premium', sold: 121, revenue: 4235000 },
    { id: 'p-3', name: 'Coklat Artisan 70%', sold: 97, revenue: 6790000 },
    { id: 'p-4', name: 'Cookies Butter 12pcs', sold: 85, revenue: 3825000 },
  ])

  return {
    labelsDays, seriesOrders, seriesRevenue,
    kpis, recentOrders, topProducts,
  }
}
