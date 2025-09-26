<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from '#app'

type Variant = 'user' | 'admin'
type BreadcrumbItem = { label: string; to?: string }
type EllipsisItem = { ellipsis: true }

const props = withDefaults(defineProps<{
  items?: BreadcrumbItem[]          // kalau diisi, autoItems diabaikan
  showHome?: boolean                // tampilkan crumb root
  variant?: Variant                 // 'user' | 'admin'
  max?: number                      // maksimal crumb yang ditampilkan sebelum di-ellipsis
  homeLabel?: string                // override label root (default tergantung variant)
  separator?: 'chevron' | 'slash'   // pemisah
}>(), {
  items: undefined,
  showHome: true,
  variant: 'user',
  max: 5,
  homeLabel: '',                    // kosong artinya pakai default sesuai variant
  separator: 'chevron',
})

const route = useRoute()

const toTitle = (s: string) =>
  s.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

// Ambil label dari meta per-segmen kalau ada
const metaLabels = computed<(string | undefined)[]>(() =>
  route.matched.map((m) => {
    const b = (m.meta as any)?.breadcrumb
    if (!b) return undefined
    if (typeof b === 'function') return b(route)
    return String(b)
  })
)

// Generate crumb otomatis dari path
const autoItems = computed<BreadcrumbItem[]>(() => {
  const path = route.path.split('?')[0]
  const segs = path.split('/').filter(Boolean)
  let acc = ''
  return segs.map((seg, i) => {
    acc += '/' + seg
    const isLast = i === segs.length - 1
    const metaLabel = metaLabels.value[i]
    const label = metaLabel ?? toTitle(decodeURIComponent(seg))
    return { label, to: isLast ? undefined : acc }
  })
})

// Crumb root (Home/Dashboard)
const homeItem = computed<BreadcrumbItem>(() => {
  const isAdmin = props.variant === 'admin'
  const to = isAdmin ? '/admin/dashboard' : '/'
  const label = props.homeLabel || (isAdmin ? 'Home' : 'Home')
  return { label, to }
})

// Gabungkan root + base items dengan aturan khusus admin
const rawItems = computed<BreadcrumbItem[]>(() => {
  const base = props.items ?? autoItems.value
  if (!props.showHome) return base

  if (props.variant === 'admin' && base.length) {
    const first = base[0]
    const firstTo = first.to ?? ''
    if (firstTo.startsWith('/admin') || first.label.toLowerCase() === 'admin') {
      return [homeItem.value, ...base.slice(1)]
    }
  }

  const firstTo = base[0]?.to ?? ''
  if (firstTo !== '/') {
    return [homeItem.value, ...base]
  }
  return base
})

const items = computed<(BreadcrumbItem | EllipsisItem)[]>(() => {
  const arr = rawItems.value
  const max = Math.max(props.max ?? 5, 2)
  if (arr.length <= max) return arr
  const keepHead = 2
  const keepTail = 2
  return [...arr.slice(0, keepHead), { ellipsis: true }, ...arr.slice(arr.length - keepTail)]
})
</script>

<template>
  <nav aria-label="Breadcrumb" class="text-sm">
    <ol class="flex flex-wrap justify-end items-center gap-1 text-gray-600">
      <template v-for="(it, idx) in items" :key="`crumb-${idx}`">
        <!-- item -->
        <li v-if="!(it as EllipsisItem).ellipsis" class="inline-flex items-center gap-1">
          <NuxtLink
            v-if="(it as BreadcrumbItem).to"
            :to="(it as BreadcrumbItem).to!"
            class="hover:text-blue-600 dark:hover:text-blue-400"
          >
            {{ (it as BreadcrumbItem).label }}
          </NuxtLink>
          <span
            v-else
            class="font-medium text-blue-600 dark:text-blue-400"
            aria-current="page"
          >
            {{ (it as BreadcrumbItem).label }}
          </span>
        </li>

        <!-- ellipsis -->
        <li v-else class="select-none px-1">…</li>

        <!-- separator -->
        <li
          v-if="idx < items.length - 1"
          aria-hidden="true"
          class="mx-1 opacity-60"
        >
          <span v-if="separator === 'slash'">/</span>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5"
               viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1
                     1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd" />
          </svg>
        </li>
      </template>
    </ol>
  </nav>
</template>
