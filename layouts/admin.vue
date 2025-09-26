<!-- layouts/admin.vue -->
<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
const logout = () => { navigateTo('/admin/logout') }
</script>

<template>
  <div class="min-h-screen text-gray-900">
    <!-- SIDEBAR -->
    <AppSidebar v-model:open="open" :notifications="5" :isAuthenticated="true" @logout="logout" />

    <!-- TOP BAR (MOBILE) -->
    <header class="sticky top-0 z-30 border-b border-gray-200 bg-white/80 backdrop-blur
                   dark:border-neutral-800 dark:bg-neutral-900/70 lg:hidden">
      <div class="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <button
          class="rounded-md p-2 hover:bg-gray-100 dark:hover:bg-neutral-800"
          aria-label="Open menu"
          @click="open = true"
        >
          <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"/>
          </svg>
        </button>
        <NuxtLink to="/admin" class="text-sm font-semibold">Dashboard</NuxtLink>
        <div class="w-10" />
      </div>
    </header>

    <!-- MAIN -->
    <main class="lg:ml-64">
        <slot />
    </main>
  </div>
</template>
