<!-- components/AppSidebar.vue -->
<script setup lang="ts">
import { watch } from "vue";
import { useRoute } from "#app";
import { useNavMenu, type NavItem } from "@/composables/useNavMenu";
import { Icon } from "@iconify/vue";

const props = withDefaults(
  defineProps<{
    open?: boolean; // untuk mobile drawer
    notifications?: number;
    isAuthenticated?: boolean;
  }>(),
  {
    open: false,
    notifications: 0,
    isAuthenticated: true,
  }
);

const emit = defineEmits<{
  (e: "update:open", v: boolean): void;
  (e: "logout"): void;
}>();

// Ambil menu admin dari composable kamu
const { items } = useNavMenu("admin", props.isAuthenticated);

const route = useRoute();
const isActive = (i: NavItem) =>
  i.exact ? route.path === (i.to || "") : route.path.startsWith(i.to || "");

// Tutup drawer mobile saat pindah halaman
watch(
  () => route.path,
  () => emit("update:open", false)
);
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
    class="fixed inset-y-0 left-0 z-50 w-64 shrink-0 border-r border-gray-200 backdrop-blur bg-gray-800 transform transition-transform duration-200 -translate-x-full lg:translate-x-0"
    :class="open ? 'translate-x-0' : ''"
  >
    <!-- Brand / Header -->
    <div class="flex h-16 items-center gap-2 border-b border-gray-200 px-4">
      <!-- Close (mobile) -->
      <button
        class="lg:hidden rounded-md p-2 hover:bg-gray-100 dark:hover:bg-neutral-800"
        aria-label="Close menu"
        @click="emit('update:open', false)"
      >
        <svg
          class="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <div class="flex items-center gap-2">
        <span class="text-base text-white font-semibold tracking-tight"
          >MyCommerce</span
        >
        <span
          class="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-300 bg-amber-400/10"
          >Admin</span
        >
      </div>
    </div>

    <!-- Menu -->
    <nav class="flex h-[calc(100%-4rem)] flex-col overflow-y-auto px-2 py-3">
      <p class="mb-2 px-2 text-gray-500 uppercase text-xs">menu</p>
      <ul class="space-y-1">
        <li v-for="(item, i) in items" :key="i">
          <NuxtLink
            :to="item.to || '#'"
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-yellow-500"
            :class="
              isActive(item)
                ? 'bg-gray-100 text-white dark:bg-yellow-500'
                : 'text-gray-700 dark:text-gray-200'
            "
          >
            <Icon
              v-if="item.icon"
              :icon="item.icon"
              class="h-4 w-4 shrink-0 opacity-80"
              aria-hidden="true"
            />

            <!-- (Opsional) taruh ikon di sini kalau perlu -->
            <span>{{ item.label }}</span>

            <span
              v-if="
                notifications &&
                (item.to?.includes('/pesanan') ||
                  item.to?.includes('/notifikasi'))
              "
              class="ml-auto inline-flex min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-[10px] font-semibold text-white"
              >{{ notifications }}</span
            >
          </NuxtLink>
        </li>
      </ul>

      <div class="mt-auto border-t border-gray-200 pt-3">
        <NuxtLink
          to="/admin/pengaturan"
          class="rounded-lg gap-2 flex px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-neutral-800"
        >
          <Iconify icon="uil:setting" class="w-5 h-5" />
          Pengaturan
        </NuxtLink>
        <button
          class="mt-1 w-full flex gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
          @click="$emit('logout')"
        >
          <Iconify icon="material-symbols:logout" class="w-5 h-5" />
          Keluar
        </button>
      </div>
    </nav>
  </aside>
</template>
