<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import Pagination from "~/components/global/Pagination.vue";
import Iconify from "~/components/iconify.vue";
import type { Product } from "~/models/Product";

definePageMeta({ layout: "admin", breadcrumb: "Products" });

const store = useProduct();

onMounted(async () => {
  await store.getProducts();
});

const removingId = ref<number|null>(null)

const remove = async (id: number) => {
  if (!confirm('Delete this product?')) return
  removingId.value = id
  const ok = await store.deleteProduct(id) 
  removingId.value = null
}

const page = ref(1);
const pageSize = ref(10);
const total = computed(() => store.products.length);
const pagedProducts = computed(() => {
  const start = (page.value - 1) * pageSize.value;
  return store.products.slice(start, start + pageSize.value);
});

// ===== Helpers =====
const fmtIDR = (v: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(v);

// ===== Add Product (modal sederhana) =====
const addOpen = ref(false)
const add = ref({ title:'', price:0, description:'', image:'', category:'' })

const saveAdd = async () => {
  const created = await store.createProduct({
    title: add.value.title.trim(),
    price: Number(add.value.price),
    description: add.value.description?.trim() || '',
    image: add.value.image?.trim() || 'https://via.placeholder.com/150',
    category: add.value.category?.trim() || 'general'
  })
  if (created) {
    addOpen.value = false
    add.value = { title:'', price:0, description:'', image:'', category:'' }
  }
}


const openAdd = () => {
  addOpen.value = true;
  if (process.client) document.documentElement.style.overflow = "hidden";
};
const closeAdd = () => {
  addOpen.value = false;
  if (process.client) document.documentElement.style.overflow = "";
};

// ===== Detail Modal (FETCH per-item) =====
const isDetailOpen = ref(false);
const selectedId = ref<number | null>(null);
const detailLoading = computed(() => isDetailOpen.value && store.loading);

const openDetail = async (row: Product) => {
  selectedId.value = row.id;
  isDetailOpen.value = true;
  if (process.client) document.documentElement.style.overflow = "hidden";
  await store.getProduct(row.id);   // ⬅️ HIT API detail
};

const closeDetail = () => {
  isDetailOpen.value = false;
  selectedId.value = null;
  if (process.client) document.documentElement.style.overflow = "";
};

// ESC untuk nutup modal
const onKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape") {
    if (isDetailOpen.value) closeDetail();
    if (addOpen.value) closeAdd();
  }
};
onMounted(() => window.addEventListener("keydown", onKeydown));
onBeforeUnmount(() => window.removeEventListener("keydown", onKeydown));

// Prev/Next di modal → panggil getProduct lagi untuk id sebelahnya
const curIndex = computed(() => {
  if (selectedId.value == null) return -1;
  return store.products.findIndex((p) => p.id === selectedId.value);
});
const hasPrev = computed(() => curIndex.value > 0);
const hasNext = computed(
  () => curIndex.value >= 0 && curIndex.value < store.products.length - 1
);

const prev = async () => {
  if (!hasPrev.value) return;
  const item = store.products[curIndex.value - 1];
  selectedId.value = item.id;
  await store.getProduct(item.id);
};
const next = async () => {
  if (!hasNext.value) return;
  const item = store.products[curIndex.value + 1];
  selectedId.value = item.id;
  await store.getProduct(item.id);
};

// --- EDIT MODAL STATE + HANDLER ---
const editOpen = ref(false)
const edit = ref<{ id: number | string; title: string; price: number; description: string; image: string; category: string }>({
  id: 0, title: '', price: 0, description: '', image: '', category: ''
})

function startEdit(p: Product) {
  edit.value = {
    id: p.id,
    title: p.title,
    price: Number(p.price),
    description: p.description,
    image: p.image,
    category: p.category
  }
  editOpen.value = true
  if (process.client) document.documentElement.style.overflow = 'hidden'
}

function closeEdit() {
  editOpen.value = false
  if (process.client) document.documentElement.style.overflow = ''
}

async function saveEdit() {
  const payload = {
    title: edit.value.title.trim(),
    price: Number(edit.value.price || 0),
    description: (edit.value.description || '').trim(),
    image: (edit.value.image || '').trim(),
    category: (edit.value.category || '').trim(),
  }
  const ok = await store.updateProduct(edit.value.id, payload)
  if (ok) closeEdit()
}


</script>


<template>
  <div class="mx-auto max-w-7xl space-y-6 px-4 py-4">
    <!-- Header + breadcrumb -->
    <div class="mb-2 flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-2xl font-semibold">All Products</h1>
      <Breadcrump variant="admin" :max="4" />
    </div>

    <div class="container rounded-lg bg-gray-100 p-2">
      <!-- Header kecil + search + add -->
      <div class="flex items-center justify-between">
        <div class="mb-3">
          <h2 class="text-xl font-semibold">List Products</h2>
          <p class="text-sm font-light text-gray-500">
            Manage your catalog — create, edit, and track items easily.
          </p>
        </div>

        <div class="mb-3 w-full max-w-sm">
          <div class="relative">
            <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Iconify icon="material-symbols-light:search" class="h-5 w-5 text-slate-400" />
            </span>
            <input
              type="text"
              placeholder="Search product..."
              class="w-full rounded-md border border-black bg-white py-2 pl-10 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
        </div>

        <div class="mb-3">
          <button
            class="flex items-center rounded-md border border-gray-200 bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
            @click="openAdd"
          >
            <Iconify icon="material-symbols:add-rounded" class="h-5 w-5" />
            <span class="ml-1">Add Product</span>
          </button>
        </div>
      </div>

      <!-- Table -->
      <div class="grid gap-4 lg:grid-cols-3">
        <div class="lg:col-span-3">
          <div class="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table class="min-w-full table-auto text-sm">
              <thead class="bg-gray-50 text-gray-700">
                <tr>
                  <th class="px-4 py-3 text-left font-semibold">No</th>
                  <th class="px-4 py-3 text-left font-semibold">Title</th>
                  <th class="px-4 py-3 text-left font-semibold">Price</th>
                  <th class="px-4 py-3 text-left font-semibold">Image</th>
                  <th class="px-4 py-3 text-left font-semibold">Category</th>
                  <th class="px-4 py-3 text-left font-semibold">Description</th>
                  <th class="px-4 py-3 text-left font-semibold">Action</th>
                </tr>
              </thead>

              <tbody class="divide-y divide-gray-200 text-gray-700">
                <tr
                  v-for="(p, index) in pagedProducts"
                  :key="p.id"
                  class="hover:bg-gray-50"
                >
                  <td class="px-4 py-3">{{ (page - 1) * pageSize + index + 1 }}</td>
                  <td class="px-4 py-3">
                    <div class="max-w-[260px] truncate font-medium">
                      {{ p.title }}
                    </div>
                  </td>
                  <td class="px-4 py-3 font-semibold">{{ fmtIDR(p.price) }}</td>
                  <td class="px-4 py-3">
                    <img
                      :src="p.image"
                      alt=""
                      class="h-12 w-12 rounded-md object-cover ring-1 ring-gray-200"
                      loading="lazy"
                    />
                  </td>
                  <td class="px-4 py-3">
                    <span class="inline-flex rounded-full px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100">
                      {{ p.category }}
                    </span>
                  </td>
                  <td class="px-4 py-3">
                    <span class="block max-w-[360px] truncate" :title="p.description">
                      {{ p.description }}
                    </span>
                  </td>
                  <td class="px-4 py-3 flex gap-2">
                    <button
                      class="rounded-md flex p-2 items-center border border-gray-200 bg-blue-600 hover:bg-blue-500"
                      title="Edit"
                        @click="startEdit(p)"
                    >
                      <Iconify icon="bx:edit" class="h-5 w-5 text-white" />
                    </button>
                    <button
                      class="rounded-md border p-2 flex border-gray-200 bg-green-600 hover:bg-green-500"
                      title="Detail"
                      @click="openDetail(p)"
                    >
                      <Iconify icon="mdi:eye-outline" class="h-5 w-5 text-white" />
                    </button>
                    <button
                      class="rounded-md border p-2 border-gray-200 bg-red-600 hover:bg-red-500"
                      title="Delete"
                      @click="remove(p.id)"
                    >
                      <Iconify icon="mdi:delete-outline" class="h-5 w-5 text-white" />
                    </button>
                  </td>
                </tr>

                <tr v-if="!store.products.length">
                  <td colspan="7" class="px-4 py-6 text-center text-sm text-gray-500">
                    No products yet.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- ✅ Pagination -->
          <Pagination
            class="mt-4"
            :total-items="total"
            v-model:page="page"
            v-model:pageSize="pageSize"
            :sibling-count="1"
            :boundary-count="1"
            :show-page-size="true"
            :show-edges="true"
          />
        </div>
      </div>
    </div>
  </div>

  <!-- ===== Modal Detail Product ===== -->
<!-- ===== Modal Detail Product (fetch per-item) ===== -->
<Teleport to="body">
  <Transition
    enter-active-class="duration-150 ease-out"
    enter-from-class="opacity-0 translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="duration-150 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-2"
  >
    <div v-if="isDetailOpen" class="fixed inset-0 z-50">
      <div class="absolute inset-0 bg-black/60" @click="closeDetail"></div>

      <div
        class="relative mx-auto mt-14 w-[min(680px,92vw)] rounded-2xl bg-white p-5 shadow-xl"
        role="dialog"
        aria-modal="true"
      >
        <!-- Loading detail -->
        <div v-if="detailLoading" class="flex items-center gap-3 text-gray-600">
          <Iconify icon="eos-icons:loading" class="h-5 w-5 animate-spin" />
          <span>Loading detail…</span>
        </div>

        <!-- Error -->
        <div v-else-if="store.error" class="text-red-600">
          {{ store.error }}
        </div>

        <!-- Konten detail -->
        <div v-else-if="store.product" class="flex items-start gap-4">
          <img
            :src="store.product.image"
            alt=""
            class="h-28 w-28 rounded-lg object-cover ring-1 ring-gray-200"
          />
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ store.product.title }}
            </h3>
            <div class="mt-1 flex flex-wrap items-center gap-2">
              <span class="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                {{ store.product.category }}
              </span>
              <span class="text-xs font-mono text-gray-500">
                ID: {{ store.product.id }}
              </span>
            </div>
            <div class="mt-2 text-base font-bold text-indigo-600">
              {{ fmtIDR(store.product.price) }}
            </div>

            <div class="mt-4">
              <h4 class="text-sm font-semibold text-gray-800">Description</h4>
              <p class="mt-1 whitespace-pre-line text-sm text-gray-600">
                {{ store.product.description }}
              </p>
            </div>
          </div>

          <button
            class="rounded-md p-2 text-gray-500 hover:bg-gray-100"
            @click="closeDetail"
            aria-label="Close"
          >
            <Iconify icon="material-symbols:close" class="w-5 h-5" />
          </button>
        </div>

        <!-- Footer Prev/Next -->
        <div class="mt-6 flex items-center justify-between gap-2">
          <span class="text-xs text-gray-400">
            {{ hasPrev ? '← Prev' : '' }} {{ hasNext ? ' | Next →' : '' }}
          </span>
          <div class="flex gap-2">
            <button
              class="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              :disabled="!hasPrev"
              @click="prev"
            >
              Prev
            </button>
            <button
              class="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              :disabled="!hasNext"
              @click="next"
            >
              Next
            </button>
            <button
              class="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500"
              @click="closeDetail"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</Teleport>


  <!-- ===== Modal Add Product ===== -->
  <Teleport to="body">
    <div v-if="addOpen" class="fixed inset-0 z-50">
      <div class="absolute inset-0 bg-black/50" @click="closeAdd"></div>

      <form
        class="relative mx-auto mt-16 w-[min(520px,92vw)] rounded-xl bg-white p-4 shadow"
        @submit.prevent="saveAdd"
      >
        <h3 class="mb-3 text-lg font-semibold">Add Product</h3>

        <div class="grid gap-3">
          <input v-model.trim="add.title" type="text" placeholder="Title" class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" required />
          <input v-model.trim="add.price" type="number" placeholder="Price (IDR)" class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" required />
          <input v-model.trim="add.category" type="text" placeholder="Category" class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
          <input v-model.trim="add.image" type="url" placeholder="Image URL (optional)" class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
          <textarea v-model.trim="add.description" rows="3" placeholder="Description" class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"></textarea>
        </div>

        <div class="mt-4 flex justify-end gap-2">
          <button type="button" class="rounded-md border px-3 py-1.5 text-sm" @click="closeAdd">Cancel</button>
          <button type="submit" class="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white">Save</button>
        </div>
      </form>
    </div>
  </Teleport>

  <!-- ===== Modal Edit Product (Teleport) ===== -->
<Teleport to="body">
  <div v-if="editOpen" class="fixed inset-0 z-50">
    <!-- overlay -->
    <div class="absolute inset-0 bg-black/50" @click="closeEdit"></div>

    <!-- panel -->
    <form
      class="relative mx-auto mt-16 w-[min(560px,92vw)] rounded-xl bg-white p-4 shadow"
      @submit.prevent="saveEdit"
    >
      <div class="flex items-start justify-between">
        <h3 class="text-lg font-semibold">Edit Product</h3>
        <button type="button" class="rounded p-2 hover:bg-gray-100" @click="closeEdit" aria-label="Close">
          <Iconify icon="material-symbols:close" class="w-5 h-5" />
        </button>
      </div>

      <div class="mt-4 grid gap-3">
        <!-- preview image -->
        <div class="flex items-center gap-3">
          <img :src="edit.image || 'https://via.placeholder.com/96'" alt="" class="h-16 w-16 rounded object-cover ring-1 ring-gray-200" />
          <div class="text-xs text-gray-500">Preview</div>
        </div>

        <label class="block">
          <span class="mb-1 block text-sm font-medium text-gray-700">Title</span>
          <input
            v-model.trim="edit.title"
            type="text"
            required
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            placeholder="Product title"
          />
        </label>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label class="block">
            <span class="mb-1 block text-sm font-medium text-gray-700">Price (IDR)</span>
            <input
              v-model.number="edit.price"
              type="number"
              min="0"
              step="1000"
              required
              class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="100000"
            />
          </label>

          <label class="block">
            <span class="mb-1 block text-sm font-medium text-gray-700">Category</span>
            <input
              v-model.trim="edit.category"
              type="text"
              class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="e.g. electronics"
            />
          </label>
        </div>

        <label class="block">
          <span class="mb-1 block text-sm font-medium text-gray-700">Image URL</span>
          <input
            v-model.trim="edit.image"
            type="url"
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            placeholder="https://…"
          />
        </label>

        <label class="block">
          <span class="mb-1 block text-sm font-medium text-gray-700">Description</span>
          <textarea
            v-model.trim="edit.description"
            rows="3"
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            placeholder="Short description"
          ></textarea>
        </label>
      </div>

      <div class="mt-5 flex justify-end gap-2">
        <button type="button" class="rounded-md border px-3 py-1.5 text-sm" @click="closeEdit">Cancel</button>
        <button
          class="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
        >
       Save
        </button>
      </div>
    </form>
  </div>
</Teleport>

</template>
