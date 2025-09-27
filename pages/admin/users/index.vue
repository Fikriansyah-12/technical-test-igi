<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import Pagination from "~/components/global/Pagination.vue";
import Iconify from "~/components/iconify.vue";

definePageMeta({
  layout: "admin",
});

type ProductRow = {
  id: number | string;
  username: string;
  email: string;
  desc: string;
};

const productRows = ref<ProductRow[]>([
  {
    id: 1001,
    username: "Fikriansyah",
    email: "user@mail.com",
    desc: "Biji kopi arabica profil fruity-choco.",
  },
]);

// ===== Pagination =====
const page = ref(1);
const pageSize = ref(10);
const total = computed(() => productRows.value.length);
const startIndex = computed(() => (page.value - 1) * pageSize.value);
const pagedRows = computed(() =>
  productRows.value.slice(startIndex.value, startIndex.value + pageSize.value)
);

const addOpen = ref(false);
const add = ref({ title: "", price: "", category: "", image: "", desc: "" });


// ===== Helpers =====
const fmtIDR = (v: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(v);

// ===== State & fungsi modal detail =====
const isDetailOpen = ref(false);
const selected = ref<ProductRow | null>(null);

const openDetail = (row: ProductRow) => {
  selected.value = row;
  isDetailOpen.value = true;
  if (process.client) document.documentElement.style.overflow = "hidden";
};
const closeDetail = () => {
  isDetailOpen.value = false;
  selected.value = null;
  if (process.client) document.documentElement.style.overflow = "";
};
const onKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape" && isDetailOpen.value) closeDetail();
};
onMounted(() => window.addEventListener("keydown", onKeydown));
onBeforeUnmount(() => window.removeEventListener("keydown", onKeydown));

const curIndex = computed(() => {
  if (!selected.value) return -1;
  const sid = String(selected.value.id);
  return productRows.value.findIndex((p) => String(p.id) === sid);
});

const hasPrev = computed(() => curIndex.value > 0);
const hasNext = computed(
  () => curIndex.value >= 0 && curIndex.value < productRows.value.length - 1
);

const prev = () => {
  if (hasPrev.value) openDetail(productRows.value[curIndex.value - 1]);
};
const next = () => {
  if (hasNext.value) openDetail(productRows.value[curIndex.value + 1]);
};
</script>

<template>
  <div class="mx-auto max-w-7xl space-y-6 px-4 py-4">
    <!-- Header + breadcrumb -->
    <div class="mb-2 flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-2xl font-semibold">Users</h1>
      <Breadcrump variant="admin" :max="4" />
    </div>

    <div class="container rounded-lg bg-gray-100 p-2">
      <!-- Header kecil + search + add -->
      <div class="flex items-center justify-between">
        <div class="mb-3">
          <h2 class="text-xl font-semibold">List Users</h2>
          <p class="text-sm font-light text-gray-500">
            Manage user records—create, edit, and delete with ease.
          </p>
        </div>

        <div class="mb-3 w-full max-w-sm">
          <div class="relative">
            <span
              class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
            >
              <Iconify
                icon="material-symbols-light:search"
                class="h-5 w-5 text-slate-400"
              />
            </span>
            <input
              type="text"
              placeholder="Search users..."
              class="w-full rounded-md border border-black bg-white py-2 pl-10 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
        </div>

        <div class="mb-3">
          <button
            class="flex items-center rounded-md border border-gray-200 bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
          >
            <Iconify icon="material-symbols:add-rounded" class="h-5 w-5" />
            <span class="ml-1">Add Users</span>
          </button>
        </div>
      </div>

      <!-- Table -->
      <div class="grid gap-4 lg:grid-cols-3">
        <div class="lg:col-span-3">
          <div
            class="overflow-x-auto rounded-lg border border-gray-200 bg-white"
          >
            <table class="min-w-full table-auto text-sm">
              <thead class="bg-gray-50 text-gray-700">
                <tr>
                  <th class="px-4 py-3 text-left font-semibold">No</th>
                  <th class="px-4 py-3 text-left font-semibold">ID</th>
                  <th class="px-4 py-3 text-left font-semibold">Username</th>
                  <th class="px-4 py-3 text-left font-semibold">Email</th>
                  <th class="px-4 py-3 text-left font-semibold">Action</th>
                </tr>
              </thead>

              <tbody class="divide-y divide-gray-200 text-gray-700">
                <!-- 👉 gunakan pagedRows agar pagination benar2 bekerja -->
                <tr
                  v-for="(p, i) in pagedRows"
                  :key="p.id"
                  class="hover:bg-gray-50"
                >
                  <td class="px-4 py-3">{{ startIndex + i + 1 }}</td>
                  <td class="px-4 py-3 font-mono text-xs text-gray-500">
                    {{ p.id }}
                  </td>
                  <td class="px-4 py-3">
                    <div class="max-w-[260px] truncate font-medium">
                      {{ p.username }}
                    </div>
                  </td>
                  <td class="px-4 py-3 font-semibold">{{ p.email }}</td>
                  <td class="px-4 py-3 flex gap-2">
                    <button
                      class="rounded-md flex p-2 items-center border border-gray-200 bg-blue-600 text-xs font-semibold text-gray-700 hover:bg-blue-500"
                    >
                      <Iconify icon="bx:edit" class="h-5 w-5 text-white" />
                    </button>
                    <button
                      class="rounded-md border p-2 flex border-gray-200 bg-green-600 text-xs font-semibold text-gray-700 hover:bg-green-500"
                    >
                      <Iconify
                        icon="mdi:eye-outline"
                        class="h-5 w-5 text-white"
                      />
                    </button>
                    <button
                      class="rounded-md border p-2 border-gray-200 bg-red-600 text-xs font-semibold text-gray-700 hover:bg-red-500"
                    >
                      <Iconify
                        icon="mdi:delete-outline"
                        class="h-5 w-5 text-white"
                      />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- Pagination -->
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
          <!-- <div class="flex items-start gap-4">
            <NuxtImg
              :src="selected?.image"
              alt="image"
              quality="80"
              preload
              loading="lazy"
              class="w-2/5 rounded-lg object-cover ring-1 ring-gray-200"
            />
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900">
                {{ selected?.title }}
              </h3>
              <div class="mt-1 flex flex-wrap items-center gap-2">
                <span
                  class="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700"
                  >{{ selected?.category }}</span
                >
                <span class="text-xs font-mono text-gray-500"
                  >ID: {{ selected?.id }}</span
                >
              </div>
              <div class="mt-2 text-base font-bold text-indigo-600">
                {{ selected ? fmtIDR(selected.price) : "" }}
              </div>
              <div class="mt-4">
                <h4 class="text-sm font-semibold text-gray-800">Description</h4>
                <p class="mt-1 whitespace-pre-line text-sm text-gray-600">
                  {{ selected?.desc }}
                </p>
              </div>
            </div>

            <button
              class="rounded-md p-2 text-gray-500 bg-gray-200 hover:bg-gray-100"
              @click="closeDetail"
              aria-label="Close"
            >
              <Iconify icon="material-symbols:close" class="w-5 h-5" />
            </button>
          </div> -->
        </div>
      </div>
    </Transition>
  </Teleport>

  <Teleport to="body">
    <div v-if="addOpen" class="fixed inset-0 z-50">
      <!-- overlay -->
      <div class="absolute inset-0 bg-black/50" ></div>

      <!-- panel -->
      <form
        class="relative mx-auto mt-16 w-[min(520px,92vw)] rounded-xl bg-white p-4 shadow"
      >
        <h3 class="mb-3 text-lg font-semibold">Add Product</h3>

        <div class="grid gap-3">
          <input
            v-model.trim="add.title"
            type="text"
            placeholder="Title"
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            required
          />
          <input
            v-model.trim="add.price"
            type="number"
            placeholder="Price (IDR)"
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            required
          />
          <input
            v-model.trim="add.category"
            type="text"
            placeholder="Category"
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          <input
            v-model.trim="add.image"
            type="url"
            placeholder="Image URL (optional)"
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          <textarea
            v-model.trim="add.desc"
            rows="3"
            placeholder="Description"
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          ></textarea>
        </div>

        <div class="mt-4 flex justify-end gap-2">
          <button
            type="button"
            class="rounded-md border px-3 py-1.5 text-sm"
          >
            Cancel
          </button>
          <button
            class="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </Teleport>
</template>
