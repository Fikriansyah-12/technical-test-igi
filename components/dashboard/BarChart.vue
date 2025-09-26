<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  labels: string[]
  values: number[]
  height?: number
}>()

const height = computed(() => props.height ?? 160)
const maxVal = computed(() => Math.max(1, ...props.values))
</script>

<template>
  <div class="rounded-2xl border border-black/20 bg-white p-4 shadow-sm">
    <div class="mb-3 flex items-center justify-between">
      <slot name="title"><h3 class="text-lg text-black font-medium">Bar Chart</h3></slot>
      <slot name="actions"></slot>
    </div>

    <div class="relative">
      <svg :viewBox="`0 0 ${values.length * 36} ${height}`" class="w-full" :height="height" role="img" aria-label="Bar chart">
        <g v-for="(v, i) in values" :key="i" :transform="`translate(${i * 36}, 0)`">
          <rect
            :x="8" :y="height - (v / maxVal) * (height - 20) - 1"
            width="20" :height="(v / maxVal) * (height - 20)"
            class="fill-blue-600/80 dark:fill-blue-400/80" rx="6"
          />
          <text :x="18" :y="height - 2" text-anchor="middle" class="fill-gray-500 text-[10px]">
            {{ labels[i] }}
          </text>
        </g>
      </svg>
    </div>
  </div>
</template>
