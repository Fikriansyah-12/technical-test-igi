<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter, navigateTo } from '#app'
import { useNavMenu, type Role, type NavItem } from '@/composables/useNavMenu'
import { useCart } from '@/composables/useCart'
import { useAuth } from '@/composables/useAuth'

const props = withDefaults(defineProps<{
  role?: Role
  notifications?: number
  showSearch?: boolean
  placeholder?: string
}>(), {
  role: 'user',
  notifications: 0,
  showSearch: true,
  placeholder: 'Cari produk…'
})

const route = useRoute()
const router = useRouter()
const { items } = useNavMenu(props.role, true)

const q = ref('')
const mobileOpen = ref(false)
const profileOpen = ref(false)

const cartStore = useCart()
const cartCount = computed(() => cartStore.count)

const auth = useAuth()
auth.refresh?.()
const isAuthenticated = computed(() => !!auth.token)
const userInitial = computed(() => (auth.user?.username?.[0] || '?').toUpperCase())

const isActive = (item: NavItem) =>
  item.exact ? route.path === item.to : route.path.startsWith(item?.to || '')

const onSubmit = () => {
  const term = q.value.trim()
  router.push({ path: '/products', query: term ? { q: term } : {} })
}
const clearSearch = () => {
  q.value = ''
  if (route.path.startsWith('/products')) router.replace({ query: {} })
}

const onLogout = async () => {
  profileOpen.value = false
  auth.logout({ next: '/auth/login' })
}

watch(() => route.fullPath, () => {
  mobileOpen.value = false
  profileOpen.value = false
})

let kb: (e: KeyboardEvent) => void
onMounted(() => {
  kb = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault()
      const el = document.getElementById('global-search') as HTMLInputElement | null
      el?.focus(); el?.select()
    }
  }
  window.addEventListener('keydown', kb)
})
onBeforeUnmount(() => window.removeEventListener('keydown', kb))
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-gray-200/70 bg-white/80 backdrop-blur dark:bg-neutral-900/70 dark:border-neutral-800">
    <nav class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <div class="flex items-center gap-3">
          <button class="lg:hidden rounded-md p-2 hover:bg-gray-100 dark:hover:bg-neutral-800"
                  @click="mobileOpen = !mobileOpen" aria-label="Toggle menu">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
            </svg>
          </button>

          <NuxtLink to="/" class="flex items-center gap-2">
            <span class="text-lg font-semibold">MyCommerce</span>
            <span v-if="role==='admin'" class="ml-2 rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">Admin</span>
          </NuxtLink>
        </div>

        <div class="hidden lg:flex lg:items-center lg:gap-1">
          <NuxtLink v-for="(item, i) in items" :key="i" :to="item.to || '#'"
                    class="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-neutral-800"
                    :class="isActive(item) ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-200'">
            {{ item.label }}
          </NuxtLink>
        </div>

        <div class="flex items-center gap-2">
          <form v-if="showSearch" @submit.prevent="onSubmit" class="relative hidden md:block">
            <input id="global-search" v-model="q" :placeholder="placeholder"
                   class="w-72 rounded-xl border border-gray-300 bg-white pl-3 pr-20 py-2 text-sm outline-none focus:border-indigo-500 dark:bg-neutral-900 dark:border-neutral-700" />
            <div class="absolute right-2 top-1.5 flex items-center gap-1.5">
              <button v-if="q" type="button" @click="clearSearch"
                      class="rounded-md px-2 py-1 text-[10px] text-gray-500 hover:bg-gray-100 dark:hover:bg-neutral-800">Clear</button>
              <button type="submit"
                      class="rounded-md bg-indigo-600 px-2 py-1 text-[10px] font-semibold text-white hover:bg-indigo-700">Search</button>
            </div>
          </form>

          <NuxtLink v-if="role==='user'" to="/user/cart"
                    class="relative rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-neutral-800">
            <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M2.25 3h1.386a1.5 1.5 0 0 1 1.415 1.04l.548 1.64M7.5 14.25h9.75a1.5 1.5 0 0 0 1.434-1.074l1.784-6.246A.75.75 0 0 0 19.75 6H5.598M7.5 14.25 5.599 6.68M7.5 14.25l-.9 3.15M17.25 14.25l.9 3.15M6.6 17.4h12.3M9 21a.75.75 0 1 0 0-1.5A.75.75 0 0 0 9 21Zm9 0a.75.75 0 1 0 0-1.5A.75.75 0 0 0 18 21Z"/>
            </svg>
            <span v-if="cartCount"
                  class="absolute -right-1 -top-1 rounded-full bg-indigo-600 px-1.5 text-[10px] font-semibold text-white ring-2 ring-white dark:ring-neutral-900">
              {{ cartCount }}
            </span>
          </NuxtLink>

          <!-- profil -->
          <div class="relative" v-on-click-outside="() => (profileOpen=false)">
            <button @click="profileOpen = !profileOpen"
                    class="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-neutral-800"
                    aria-haspopup="menu" :aria-expanded="profileOpen">
              <div class="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-xs font-bold text-white">
                {{ isAuthenticated ? userInitial : '?' }}
              </div>
              <svg class="h-4 w-4 opacity-70" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.08z"
                      clip-rule="evenodd"/>
              </svg>
            </button>

            <div v-if="profileOpen"
                 class="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-gray-200 bg-white/95 shadow-xl backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/95"
                 role="menu">
              <NuxtLink class="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-neutral-800"
                        :to="role==='admin' ? '/admin/profil' : '/akun'">Profil</NuxtLink>

              <button
                type="button"
                class="block w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-neutral-800"
                @mousedown.stop.prevent="onLogout"  
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- mobile search -->
      <div v-if="showSearch" class="mt-2 grid gap-2 md:hidden">
        <form @submit.prevent="onSubmit" class="relative">
          <input v-model="q" :placeholder="placeholder"
                 class="w-full rounded-xl border border-gray-300 bg-white pl-3 pr-20 py-2 text-sm outline-none focus:border-indigo-500 dark:bg-neutral-900 dark:border-neutral-700" />
          <div class="absolute right-2 top-1.5 flex items-center gap-1.5">
            <button v-if="q" type="button" @click="clearSearch"
                    class="rounded-md px-2 py-1 text-[10px] text-gray-500 hover:bg-gray-100 dark:hover:bg-neutral-800">Clear</button>
            <button type="submit"
                    class="rounded-md bg-indigo-600 px-2 py-1 text-[10px] font-semibold text-white hover:bg-indigo-700">Search</button>
          </div>
        </form>
      </div>

      <!-- mobile menu -->
      <div v-show="mobileOpen" class="mt-3 border-t border-gray-200 pt-3 dark:border-neutral-800 lg:hidden">
        <div class="grid gap-1">
          <NuxtLink v-for="(item, i) in items" :key="i" :to="item.to || '#'"
                    class="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-neutral-800"
                    :class="isActive(item) ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-200'"
                    @click="mobileOpen=false">
            {{ item.label }}
          </NuxtLink>
        </div>
      </div>
    </nav>
  </header>
</template>
