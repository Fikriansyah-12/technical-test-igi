<!-- components/AppSidebar.vue -->
<script setup lang="ts">
import { watch } from 'vue'
import { useRoute } from '#app'
import { useNavMenu, type NavItem } from '@/composables/useNavMenu'
import { Icon } from '@iconify/vue'

const props = withDefaults(defineProps<{
  open?: boolean        // untuk mobile drawer
  notifications?: number
  isAuthenticated?: boolean
}>(), {
  open: false,
  notifications: 0,
  isAuthenticated: true,
})

const emit = defineEmits<{
  (e: 'update:open', v: boolean): void
  (e: 'logout'): void
}>()

// Ambil menu admin dari composable kamu
const { items } = useNavMenu('admin', props.isAuthenticated)

const route = useRoute()
const isActive = (i: NavItem) =>
  i.exact ? route.path === (i.to || '') : route.path.startsWith(i.to || '')

// Tutup drawer mobile saat pindah halaman
watch(() => route.path, () => emit('update:open', false))
</script>

<template>
  <!-- BACKDROP (mobile) -->
  <div
    class="fixed inset-0 z-40 bg-black/40 lg:hidden"
    v-if="open"
    @click="emit('update:open', false)"
  />

  <!-- SIDEBAR -->
  <aside
    class="fixed inset-y-0 left-0 z-50 w-64 shrink-0 border-r border-gray-200 bg-white/90 backdrop-blur
           dark:border-neutral-800 dark:bg-gray-800
           transform transition-transform duration-200
           -translate-x-full lg:translate-x-0"
    :class="open ? 'translate-x-0' : ''"
  >
    <!-- Brand / Header -->
    <div class="flex h-16 items-center gap-2 border-b border-gray-200 px-4 dark:border-neutral-800">
      <!-- Close (mobile) -->
      <button
        class="lg:hidden rounded-md p-2 hover:bg-gray-100 dark:hover:bg-neutral-800"
        aria-label="Close menu"
        @click="emit('update:open', false)"
      >
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <NuxtLink to="/admin" class="flex items-center gap-2">
        <!-- <img src="/logo.svg" class="h-7 w-7" alt="Logo" /> -->
        <span class="text-base text-white font-semibold tracking-tight">MyCommerce</span>
        <span class="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700
                      dark:bg-amber-400/10 dark:text-amber-300">Admin</span>
      </NuxtLink>
    </div>

    <!-- Menu -->
    <nav class="flex h-[calc(100%-4rem)] flex-col overflow-y-auto px-2 py-3">
      <ul class="space-y-1">
        <li v-for="(item, i) in items" :key="i">
          <NuxtLink
            :to="item.to || '#'"
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium
                   hover:bg-gray-100 dark:hover:bg-yellow-500"
            :class="isActive(item)
              ? 'bg-gray-100 text-white dark:bg-yellow-500'
              : 'text-gray-700 dark:text-gray-200'"
          >
              <Icon v-if="item.icon" :icon="item.icon" class="h-4 w-4 shrink-0 opacity-80" aria-hidden="true" />

            <!-- (Opsional) taruh ikon di sini kalau perlu -->
            <span>{{ item.label }}</span>

            <!-- Badge notifikasi sederhana (contoh untuk 'Pesanan' atau halaman notifikasi) -->
            <span
              v-if="notifications && (item.to?.includes('/pesanan') || item.to?.includes('/notifikasi'))"
              class="ml-auto inline-flex min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5
                     text-[10px] font-semibold text-white"
            >{{ notifications }}</span>
          </NuxtLink>
        </li>
      </ul>

      <div class="mt-auto border-t border-gray-200 pt-3 dark:border-neutral-800">
        <NuxtLink
          to="/admin/pengaturan"
          class="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100
                 dark:text-gray-200 dark:hover:bg-neutral-800"
        >
          Pengaturan
        </NuxtLink>
        <button
          class="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600
                 hover:bg-red-50 dark:hover:bg-red-500/10"
          @click="$emit('logout')"
        >
          Keluar
        </button>
      </div>
    </nav>
  </aside>
</template>
