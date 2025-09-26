<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from '#app'

type Variant = 'user' | 'admin'
type BreadcrumbItem = { label: string; to?: string }

const props = withDefaults(defineProps<{
  items?: BreadcrumbItem[]
  showHome?: boolean
  variant?: Variant
  max?: number
  homeLabel?: string
  separator?: 'chevron' | 'slash'
}>(), {
  items: undefined,
  showHome: true,
  variant: 'user',
  max: 5,
  homeLabel: 'Home',
  separator: 'chevron',
})

const route = useRoute()

const toTitle = (s: string) =>
  s
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())

const metaLabels = computed<(string | undefined)[]>(() =>
  route.matched.map((m) => {
    const b = (m.meta as any)?.breadcrumb
    if (!b) return undefined
    if (typeof b === 'function') return b(route)
    return String(b)
  })
)

const autoItems = computed<BreadcrumbItem[]>(() => {
  const path = route.path.split('?')[0]
  const segs = path.split('/').filter(Boolean)
  let acc = ''
  const list = segs.map((seg, i) => {
    acc += '/' + seg
    const isLast = i === segs.length - 1
    const metaLabel = metaLabels.value[i]
    const label = metaLabel ?? toTitle(decodeURIComponent(seg))
    return { label, to: isLast ? undefined : acc }
  })
  return list
})

const homeItem = computed<BreadcrumbItem>(() => {
  const to = props.variant === 'admin' ? '/admin' : '/'
  return { label: props.homeLabel, to }
})

const rawItems = computed<BreadcrumbItem[]>(() => {
  const base = props.items ?? autoItems.value
  if (!props.showHome) return base
  const firstTo = base[0]?.to ?? ''
  const shouldPrepend =
    (props.variant === 'admin' ? !firstTo?.startsWith('/admin') : firstTo !== '/')
  return shouldPrepend ? [homeItem.value, ...base] : base
})

const items = computed<(BreadcrumbItem | { ellipsis: true })[]>(() => {
  const arr = rawItems.value
  const max = Math.max(props.max ?? 5, 2)
  if (arr.length <= max) return arr
  const keepHead = 2
  const keepTail = 2
  const head = arr.slice(0, keepHead)
  const tail = arr.slice(arr.length - keepTail)
  return [...head, { ellipsis: true }, ...tail]
})
</script>

<template>
  <nav aria-label="Breadcrumb" class="text-sm">
    <ol class="flex flex-wrap items-center gap-1 text-gray-600">
      <template v-for="(it, idx) in items" :key="idx">
        <!-- item -->
        <li v-if="!(it as any).ellipsis" class="inline-flex items-center gap-1">
          <NuxtLink
            v-if="(it as BreadcrumbItem).to"
            :to="(it as BreadcrumbItem).to"
            class="hover:text-blue-600 dark:hover:text-blue-400"
          >
            {{ (it as BreadcrumbItem).label }}
          </NuxtLink>
          <span v-else class="font-medium text-gray-900">
            {{ (it as BreadcrumbItem).label }}
          </span>
        </li>

        <!-- ellipsis -->
        <li v-else class="select-none px-1">…</li>

        <li v-if="idx < items.length - 1" aria-hidden="true" class="mx-0.5 opacity-60">
          <span v-if="separator === 'slash'">/</span>
          <svg v-else class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L9.586 11 7.293 8.707A1 1 0 118.707 7.293l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
          </svg>
        </li>
      </template>
    </ol>
  </nav>
</template>
