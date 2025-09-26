<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  data: number[]
  width?: number
  height?: number
  strokeWidth?: number
  showArea?: boolean
}>(), {
  width: 140,
  height: 40,
  strokeWidth: 2,
  showArea: true,
})

const points = computed(() => {
  const d = props.data.length ? props.data : [0]
  const min = Math.min(...d)
  const max = Math.max(...d)
  const w = props.width
  const h = props.height
  const padX = 0
  const padY = 2
  const dx = d.length > 1 ? (w - padX * 2) / (d.length - 1) : 0
  const mapY = (v: number) => {
    if (max === min) return h / 2
    const t = (v - min) / (max - min)
    return h - (t * (h - padY * 2) + padY)
  }
  return d.map((v, i) => [padX + i * dx, mapY(v)] as [number, number])
})

const path = computed(() =>
  points.value.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(' ')
)

const areaPath = computed(() => {
  const pts = points.value
  const baseY = props.height
  if (!pts.length) return ''
  return [
    `M ${pts[0][0]} ${baseY}`,
    `L ${pts[0][0]} ${pts[0][1]}`,
    ...pts.slice(1).map(p => `L ${p[0]} ${p[1]}`),
    `L ${pts[pts.length - 1][0]} ${baseY}`,
    'Z',
  ].join(' ')
})
</script>

<template>
  <svg :viewBox="`0 0 ${width} ${height}`" :width="width" :height="height" role="img" aria-label="Sparkline">
    <path v-if="showArea" :d="areaPath" fill="currentColor" class="opacity-10" />
    <path :d="path" fill="none" stroke="currentColor" :stroke-width="strokeWidth" stroke-linecap="round" />
  </svg>
</template>
