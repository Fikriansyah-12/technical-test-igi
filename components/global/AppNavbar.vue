<!-- components/AppNavbar.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from '#app'
import { useNavMenu, type Role, type NavItem } from '@/composables/useNavMenu'

const props = withDefaults(defineProps<{
  role?: Role
  cartCount?: number
  notifications?: number
  showSearch?: boolean
  placeholder?: string
  isAuthenticated?: boolean
}>(), {
  role: 'user',
  cartCount: 0,
  notifications: 0,
  showSearch: true,
  placeholder: 'Cari produk…',
  isAuthenticated: false,
})

const emit = defineEmits<{
  (e: 'search', q: string): void
  (e: 'logout'): void
}>()

const route = useRoute()
const { items } = useNavMenu(props.role, props.isAuthenticated)

const q = ref('')
const mobileOpen = ref(false)
const profileOpen = ref(false)
const isActive = (item: NavItem) => item.exact ? route.path === item.to : route.path.startsWith(item?.to || '')
const onSubmit = () => { if (q.value.trim()) emit('search', q.value.trim()) }
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-gray-200/70 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-neutral-900/70 dark:border-neutral-800">
    <nav class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <!-- Left: Brand + Toggle -->
        <div class="flex items-center gap-3">
          <button class="inline-flex items-center justify-center rounded-md p-2 lg:hidden hover:bg-gray-100 dark:hover:bg-neutral-800"
                  @click="mobileOpen = !mobileOpen" aria-label="Toggle menu">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                 d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/></svg>
          </button>

          <NuxtLink to="/" class="flex items-center gap-2">
            <!-- <img src="/logo.svg" alt="Logo" class="h-7 w-7" /> -->
            <span class="text-lg font-semibold tracking-tight">MyCommerce</span>
            <span v-if="role==='admin'" class="ml-2 rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">Admin</span>
          </NuxtLink>
        </div>

        <!-- Center: Menu (desktop) -->
        <div class="hidden lg:flex lg:items-center lg:gap-1">
          <NuxtLink v-for="(item, idx) in items" :key="idx" :to="item.to || '#'"
            class="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-neutral-800"
            :class="isActive(item) ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-200'"
          >
            {{ item.label }}
          </NuxtLink>
        </div>

        <!-- Right: Search + Actions -->
        <div class="flex items-center gap-2">
          <form v-if="showSearch" @submit.prevent="onSubmit" class="hidden md:flex">
            <label class="relative">
              <input v-model="q" :placeholder="placeholder"
                     class="w-64 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-0 focus:border-primary-500 dark:bg-neutral-900 dark:border-neutral-700" />
              <button type="submit" class="absolute right-1.5 top-1.5 rounded-md px-2 py-1 text-xs hover:bg-gray-100 dark:hover:bg-neutral-800">Cari</button>
            </label>
          </form>

          <!-- Cart (user) -->
          <NuxtLink v-if="role==='user'" to="/cart" class="relative rounded-md p-2 hover:bg-gray-100 dark:hover:bg-neutral-800" aria-label="Keranjang">
            <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M2.25 3h1.386a1.5 1.5 0 0 1 1.415 1.04l.548 1.64M7.5 14.25h9.75a1.5 1.5 0 0 0 1.434-1.074l1.784-6.246A.75.75 0 0 0 19.75 6H5.598M7.5 14.25 5.599 6.68M7.5 14.25l-.9 3.15M17.25 14.25l.9 3.15M6.6 17.4h12.3M9 21a.75.75 0 1 0 0-1.5A.75.75 0 0 0 9 21Zm9 0a.75.75 0 1 0 0-1.5A.75.75 0 0 0 18 21Z"/></svg>
            <span v-if="cartCount" class="absolute -right-1 -top-1 rounded-full bg-primary-600 px-1.5 text-[10px] font-semibold text-white">{{ cartCount }}</span>
          </NuxtLink>

          <!-- Notifications (admin) -->
          <NuxtLink v-if="role==='admin'" to="/admin/notifikasi" class="relative rounded-md p-2 hover:bg-gray-100 dark:hover:bg-neutral-800" aria-label="Notifikasi">
            <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M14.25 18.75a2.25 2.25 0 1 1-4.5 0m9-6a6.75 6.75 0 1 0-13.5 0c0 3.299-1.5 4.5-1.5 4.5h16.5s-1.5-1.201-1.5-4.5Z"/></svg>
            <span v-if="notifications" class="absolute -right-1 -top-1 rounded-full bg-red-600 px-1.5 text-[10px] font-semibold text-white">{{ notifications }}</span>
          </NuxtLink>

          <!-- Profile -->
          <div class="relative">
            <button @click="profileOpen = !profileOpen" class="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-neutral-800">
              <!-- <img src="/avatar.png" alt="Avatar" class="h-7 w-7 rounded-full object-cover" /> -->
              <svg class="h-4 w-4 opacity-70" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.08z" clip-rule="evenodd"/></svg>
            </button>
            <div v-if="profileOpen"
                 @click.outside="profileOpen=false"
                 class="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
              <NuxtLink class="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-neutral-800" :to="role==='admin' ? '/admin/profil' : '/akun'">Profil</NuxtLink>
              <NuxtLink v-if="role==='user'" class="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-neutral-800" to="/akun/pesanan">Pesanan Saya</NuxtLink>
              <NuxtLink v-if="role==='admin'" class="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-neutral-800" to="/admin/activity">Aktivitas</NuxtLink>
              <button class="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-neutral-800" @click="$emit('logout')">Keluar</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Search (mobile) -->
      <div v-if="showSearch" class="mt-2 grid gap-2 md:hidden">
        <form @submit.prevent="onSubmit">
          <input v-model="q" :placeholder="placeholder"
                 class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 dark:bg-neutral-900 dark:border-neutral-700" />
        </form>
      </div>

      <!-- Mobile Menu -->
      <div v-show="mobileOpen" class="mt-3 border-t border-gray-200 pt-3 dark:border-neutral-800 lg:hidden">
        <div class="grid gap-1">
          <NuxtLink v-for="(item, idx) in items" :key="idx" :to="item.to || '#'"
            class="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-neutral-800"
            :class="isActive(item) ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-200'"
            @click="mobileOpen=false"
          >
            {{ item.label }}
          </NuxtLink>
        </div>
      </div>
    </nav>
  </header>
</template>

<style scoped>
/* Optional: set your brand color via Tailwind config (primary) */
</style>
