<script setup lang="ts">
import { computed, watch } from "vue";

const props = withDefaults(
  defineProps<{
    totalItems: number;
    page: number;
    pageSize?: number;
    pageSizes?: number[];
    siblingCount?: number;
    boundaryCount?: number;
    showPageSize?: boolean;
    showEdges?: boolean;
    disabled?: boolean;
  }>(),
  {
    pageSize: 10,
    pageSizes: () => [10, 20, 50],
    siblingCount: 1,
    boundaryCount: 1,
    showPageSize: false,
    showEdges: true,
    disabled: false,
  }
);

const emit = defineEmits<{
  (e: "update:page", v: number): void;
  (e: "update:pageSize", v: number): void;
  (e: "change", v: { page: number; pageSize: number }): void;
}>();

const pageCount = computed(() =>
  Math.max(1, Math.ceil((props.totalItems || 0) / (props.pageSize || 1)))
);

// clamp page ketika total/pageSize berubah
watch([() => props.totalItems, () => props.pageSize], () => {
  const max = pageCount.value;
  if (props.page > max) emit("update:page", max);
});

// Helper buat daftar halaman + ellipsis
const pageItems = computed<(number | "ellipsis")[]>(() => {
  const pc = pageCount.value;
  const cur = Math.min(Math.max(props.page, 1), pc);
  const sib = Math.max(props.siblingCount, 0);
  const bnd = Math.max(props.boundaryCount, 0);

  // Kumpulkan halaman yang pasti tampil (boundary + siblings)
  const set = new Set<number>();
  // boundaries awal
  for (let i = 1; i <= Math.min(bnd, pc); i++) set.add(i);
  // boundaries akhir
  for (let i = Math.max(pc - bnd + 1, 1); i <= pc; i++) set.add(i);
  // siblings sekitar current
  for (let i = cur - sib; i <= cur + sib; i++)
    if (i >= 1 && i <= pc) set.add(i);

  const nums = Array.from(set).sort((a, b) => a - b);

  // Sisipkan ellipsis di sela gap > 1
  const items: (number | "ellipsis")[] = [];
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    if (i === 0) {
      items.push(n);
      continue;
    }
    const prev = nums[i - 1];
    if (n - prev === 1) {
      items.push(n);
    } else {
      items.push("ellipsis", n);
    }
  }
  return items;
});

function go(p: number) {
  if (props.disabled) return;
  const clamped = Math.min(Math.max(p, 1), pageCount.value);
  if (clamped !== props.page) {
    emit("update:page", clamped);
    emit("change", { page: clamped, pageSize: props.pageSize });
  }
}

function onPrev() {
  go(props.page - 1);
}
function onNext() {
  go(props.page + 1);
}
function onFirst() {
  go(1);
}
function onLast() {
  go(pageCount.value);
}

function onChangeSize(e: Event) {
  const size = Number((e.target as HTMLSelectElement).value);
  emit("update:pageSize", size);
  // reset ke halaman 1 biar aman
  emit("update:page", 1);
  emit("change", { page: 1, pageSize: size });
}
</script>

<template>
  <nav
    class="flex flex-wrap items-center gap-3"
    role="navigation"
    aria-label="Pagination"
  >
    <!-- Page size -->
    <div
      v-if="showPageSize"
      class="flex items-center gap-2 text-sm text-gray-600"
    >
    <span class="text-gray-500">Showing</span>
    <span class="text-gray-500">
        {{ Math.min((page - 1) * pageSize + 1, totalItems) }} to 
        {{ Math.min(page * pageSize, totalItems) }} of {{ totalItems }}
      </span>
    </div>

    <div class="ml-auto flex items-center gap-1">
      <!-- First / Prev -->
      <button
        v-if="showEdges"
        class="rounded-md border px-2 py-1 text-sm disabled:opacity-50"
        :disabled="disabled || page <= 1"
        @click="onFirst"
        aria-label="First page"
      >
        «
      </button>

      <button
        class="rounded-md border px-2 py-1 text-sm disabled:opacity-50"
        :disabled="disabled || page <= 1"
        @click="onPrev"
        aria-label="Previous page"
      >
        ‹
      </button>

      <!-- Page items -->
      <template v-for="(it, idx) in pageItems" :key="idx">
        <button
          v-if="it !== 'ellipsis'"
          class="rounded-md border px-3 py-1.5 text-sm font-medium"
          :class="
            it === page
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
          "
          :aria-current="it === page ? 'page' : undefined"
          :disabled="disabled"
          @click="go(it as number)"
        >
          {{ it }}
        </button>
        <span v-else class="px-2 text-gray-500 select-none">…</span>
      </template>

      <!-- Next / Last -->
      <button
        class="rounded-md border px-2 py-1 text-sm disabled:opacity-50"
        :disabled="disabled || page >= pageCount"
        @click="onNext"
        aria-label="Next page"
      >
        ›
      </button>

      <button
        v-if="showEdges"
        class="rounded-md border px-2 py-1 text-sm disabled:opacity-50"
        :disabled="disabled || page >= pageCount"
        @click="onLast"
        aria-label="Last page"
      >
        »
      </button>
    </div>
  </nav>
</template>
