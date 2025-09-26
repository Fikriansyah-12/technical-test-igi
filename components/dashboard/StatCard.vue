<script setup lang="ts">
const props = withDefaults(defineProps<{
  title: string
  value: string | number
  delta?: number // persen
  hint?: string
  spark?: number[]
}>(), {})
</script>

<template>
  <div class="rounded-2xl border border-gray-200 bg-white p-4 mb-5 shadow-sm ">
    <div class="flex items-start justify-between gap-3">
      <div>
        <p class="text-xs uppercase tracking-wide text-black">{{ title }}</p>
        <p class="mt-1 text-2xl font-semibold text-gray-900">{{ value }}</p>
        <p v-if="hint" class="mt-1 text-xs text-black dark:text-gray-400">{{ hint }}</p>
        <div v-if="typeof delta === 'number'" class="mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs"
             :class="delta >= 0 ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-500'
                                : 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-500'">
          <svg v-if="delta >= 0" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 3l6 6H4l6-6Zm0 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"/></svg>
          <svg v-else class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 17l-6-6h12l-6 6Zm0-14a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"/></svg>
          <span>{{ delta }}%</span>
          <span class="opacity-70">vs last period</span>
        </div>
      </div>
      <div v-if="spark?.length" class="text-blue-600 dark:text-blue-400">
        <Sparkline :data="spark" :width="120" :height="40" />
      </div>
    </div>
  </div>
</template>
