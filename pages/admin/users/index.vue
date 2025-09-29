<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import Pagination from "~/components/global/Pagination.vue";
import Iconify from "~/components/iconify.vue";
import type { User } from "~/models/User";

definePageMeta({ layout: "admin", breadcrumb: "Users" });

const store = useUsers();

onMounted(async () => {
  await store.getUsers();
});

const removingId = ref<number | null>(null);

const remove = async (id: number) => {
  if (!confirm("Delete this product?")) return;
  removingId.value = id;
  const ok = await store.deleteUser(id);
  removingId.value = null;
};

const page = ref(1);
const pageSize = ref(10);
const total = computed(() => store.users.length);
const pagedUsers = computed(() => {
  const start = (page.value - 1) * pageSize.value;
  return store.users.slice(start, start + pageSize.value);
});
const showEditPass = ref(false);

const addOpen = ref(false);
const add = ref({ username: "", email: "", password: "" });

const saveAdd = async () => {
  const created = await store.createUser({
    username: add.value.username.trim(),
    email: add.value.email.trim(),
    password: add.value.password.trim(),
  });
  if (created) {
    addOpen.value = false;
    add.value = { username: "", email: "", password: "" };
    page.value = 1;
  }
};

const openAdd = () => {
  addOpen.value = true;
  if (process.client) document.documentElement.style.overflow = "hidden";
};
const closeAdd = () => {
  addOpen.value = false;
  if (process.client) document.documentElement.style.overflow = "";
};

const isDetailOpen = ref(false);
const selectedId = ref<number | null>(null);
const detailLoading = computed(() => isDetailOpen.value && store.loading);

const selectedUser = computed<User | null>(() => {
  if (selectedId.value == null) return store.user ?? null;
  return (
    store.users.find((u) => u.id === selectedId.value) ?? store.user ?? null
  );
});

const openDetail = async (row: User) => {
  if (!row || row.id == null) return;
  selectedId.value = row.id;
  isDetailOpen.value = true;
  if (process.client) document.documentElement.style.overflow = "hidden";
  store.user = row;
  await store.getUser(row.id);
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
    if (editOpen.value) closeEdit();
  }
};
onMounted(() => window.addEventListener("keydown", onKeydown));
onBeforeUnmount(() => window.removeEventListener("keydown", onKeydown));

const curIndex = computed(() => {
  if (selectedId.value == null) return -1;
  return store.users.findIndex((p) => p.id === selectedId.value);
});
const hasPrev = computed(() => curIndex.value > 0);
const hasNext = computed(
  () => curIndex.value >= 0 && curIndex.value < store.users.length - 1
);

const prev = async () => {
  if (!hasPrev.value) return;
  const item = store.users[curIndex.value - 1];
  if (!item) return;
  selectedId.value = item.id;
  store.user = item;
  await store.getUser(item.id);
};

const next = async () => {
  if (!hasNext.value) return;
  const item = store.users[curIndex.value + 1];
  if (!item) return;
  selectedId.value = item.id;
  store.user = item;
  await store.getUser(item.id);
};

// --- EDIT MODAL STATE + HANDLER ---
const editOpen = ref(false);
const edit = ref<{
  id: number | string;
  username: string;
  email: string;
  password: string;
}>({
  id: 0,
  username: "",
  email: "",
  password: "",
});

function startEdit(u: User) {
  edit.value = {
    id: u.id,
    username: u.username,
    email: u.email,
    password: u.password,
  };
  editOpen.value = true;
  if (process.client) document.documentElement.style.overflow = "hidden";
}

function closeEdit() {
  editOpen.value = false;
  if (process.client) document.documentElement.style.overflow = "";
}

async function saveEdit() {
  const payload = {
    username: edit.value.username.trim(),
    email: edit.value.email.trim(),
    password: edit.value.password.trim(),
  };
  const ok = await store.updateUser(edit.value.id, payload);
  if (ok) closeEdit();
}
const showPass = ref(false);
const maskedPass = computed(() =>
  store.user?.password
    ? "•".repeat(Math.min(12, store.user.password.length))
    : "—"
);
</script>

<template>
  <div class="mx-auto max-w-7xl space-y-6 px-4 py-4">
    <!-- Header + breadcrumb -->
    <div class="mb-2 flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-2xl font-semibold">All Users</h1>
      <Breadcrump variant="admin" :max="4" />
    </div>

    <div class="container rounded-lg bg-gray-100 p-2">
      <div class="flex items-center justify-between">
        <div class="mb-3">
          <h2 class="text-xl font-semibold">List Users</h2>
          <p class="text-sm font-light text-gray-500">
            Manage your users — create, edit, and detele
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
                  <th class="px-4 py-3 text-left font-semibold">Username</th>
                  <th class="px-4 py-3 text-left font-semibold">Email</th>
                  <th class="px-4 py-3 text-left font-semibold">Password</th>
                  <th class="px-4 py-3 text-left font-semibold">Action</th>
                </tr>
              </thead>

              <tbody class="divide-y divide-gray-200 text-gray-700">
                <tr
                  v-for="(u, index) in pagedUsers"
                  :key="u.id"
                  class="hover:bg-gray-50"
                >
                  <td class="px-4 py-3">
                    {{ (page - 1) * pageSize + index + 1 }}
                  </td>
                  <td class="px-4 py-3">
                    <div class="max-w-[260px] truncate font-medium">
                      {{ u.username }}
                    </div>
                  </td>
                  <td class="px-4 py-3">
                    <div class="max-w-[260px] truncate font-medium">
                      {{ u.email }}
                    </div>
                  </td>
                  <td class="px-4 py-3">
                    <div class="max-w-[260px] truncate font-medium">
                      {{ u.password }}
                    </div>
                  </td>
                  <td class="px-4 py-3 flex gap-2">
                    <button
                      class="rounded-md flex p-2 items-center border border-gray-200 bg-blue-600 hover:bg-blue-500"
                      title="Edit"
                      @click="startEdit(u)"
                    >
                      <Iconify icon="bx:edit" class="h-5 w-5 text-white" />
                    </button>
                    <button
                      class="rounded-md border p-2 flex border-gray-200 bg-green-600 hover:bg-green-500"
                      title="Detail"
                      @click="openDetail(u)"
                    >
                      <Iconify
                        icon="mdi:eye-outline"
                        class="h-5 w-5 text-white"
                      />
                    </button>
                    <button
                      class="rounded-md border p-2 border-gray-200 bg-red-600 hover:bg-red-500"
                      title="Delete"
                      @click="remove(u.id)"
                    >
                      <Iconify
                        icon="mdi:delete-outline"
                        class="h-5 w-5 text-white"
                      />
                    </button>
                  </td>
                </tr>

                <tr v-if="!store.users.length">
                  <td
                    colspan="7"
                    class="px-4 py-6 text-center text-sm text-gray-500"
                  >
                    No users yet.
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
          <div
            v-if="detailLoading"
            class="flex items-center gap-3 text-gray-600"
          >
            <Iconify icon="eos-icons:loading" class="h-5 w-5 animate-spin" />
            <span>Loading detail…</span>
          </div>

          <!-- Error -->
          <div v-else-if="store.error" class="text-red-600">
            {{ store.error }}
          </div>

          <!-- Konten detail -->
          <div
            v-else-if="selectedUser"
            class="relative rounded-lg bg-white p-4 ring-1 ring-gray-200"
          >
            <dl class="grid grid-cols-1 gap-y-3 sm:grid-cols-3 sm:gap-4">
              <dt class="text-sm font-medium text-gray-500">Username</dt>
              <dd
                class="sm:col-span-2 text-sm font-medium text-gray-900 break-words"
              >
                {{ selectedUser.username || "—" }}
              </dd>

              <dt class="text-sm font-medium text-gray-500">Email</dt>
              <dd
                class="sm:col-span-2 text-sm font-medium text-gray-900 break-words"
              >
                {{ selectedUser.email || "—" }}
              </dd>

              <dt class="text-sm font-medium text-gray-500">Password</dt>
              <dd class="sm:col-span-2">
                <div class="inline-flex items-center gap-2">
                  <span class="text-sm font-medium text-gray-900">
                    {{ showPass ? selectedUser.password || "—" : maskedPass }}
                  </span>
                  <button
                    type="button"
                    class="text-xs font-medium text-indigo-600 hover:text-indigo-500"
                    @click="showPass = !showPass"
                  >
                    {{ showPass ? "Hide" : "Show" }}
                  </button>
                </div>
              </dd>
            </dl>
          </div>

          <!-- Footer Prev/Next -->
          <div class="mt-6 flex items-center justify-between gap-2">
            <span class="text-xs text-gray-400">
              {{ hasPrev ? "← Prev" : "" }} {{ hasNext ? " | Next →" : "" }}
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

  <Teleport to="body">
    <div v-if="addOpen" class="fixed inset-0 z-50">
      <div class="absolute inset-0 bg-black/50" @click="closeAdd"></div>

      <form
        class="relative mx-auto mt-16 w-[min(520px,92vw)] rounded-xl bg-white p-4 shadow"
        @submit.prevent="saveAdd"
      >
        <h3 class="mb-3 text-lg font-semibold">Add User</h3>

        <div class="grid gap-3">
          <input
            v-model.trim="add.username"
            type="text"
            placeholder="username"
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            required
          />
          <input
            v-model.trim="add.email"
            type="text"
            placeholder="email"
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            required
          />
          <input
            v-model.trim="add.password"
            type="text"
            placeholder="password"
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            required
          />
        </div>

        <div class="mt-4 flex justify-end gap-2">
          <button
            type="button"
            class="rounded-md border px-3 py-1.5 text-sm"
            @click="closeAdd"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </Teleport>

  <Teleport to="body">
    <div v-if="editOpen" class="fixed inset-0 z-50">
      <!-- overlay -->
      <div class="absolute inset-0 bg-black/50" @click="closeEdit"></div>

      <!-- panel -->
      <form
        class="relative mx-auto mt-16 w-[min(560px,92vw)] rounded-xl bg-white p-4 shadow"
        @submit.prevent="saveEdit"
      >
        <div class="mb-3 flex items-start justify-between">
          <h3 class="text-lg font-semibold">Edit User</h3>
          <button
            type="button"
            class="rounded p-2 hover:bg-gray-100"
            @click="closeEdit"
            aria-label="Close"
          >
            <Iconify icon="material-symbols:close" class="w-5 h-5" />
          </button>
        </div>

        <!-- fields -->
        <div class="grid gap-3">
          <label class="block">
            <span class="mb-1 block text-sm font-medium text-gray-700"
              >Username</span
            >
            <input
              v-model.trim="edit.username"
              type="text"
              required
              class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="johnd"
            />
          </label>

          <label class="block">
            <span class="mb-1 block text-sm font-medium text-gray-700"
              >Email</span
            >
            <input
              v-model.trim="edit.email"
              type="email"
              required
              class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="john@example.com"
              autocomplete="email"
            />
          </label>

          <label class="block">
            <span class="mb-1 block text-sm font-medium text-gray-700"
              >Password</span
            >
            <div class="flex items-center gap-2">
              <input
                :type="showEditPass ? 'text' : 'password'"
                v-model.trim="edit.password"
                class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="••••••••"
                autocomplete="new-password"
              />
              <button
                type="button"
                class="text-xs font-medium text-indigo-600 hover:text-indigo-500"
                @click="showEditPass = !showEditPass"
              >
                {{ showEditPass ? "Hide" : "Show" }}
              </button>
            </div>
          </label>
        </div>

        <div class="mt-5 flex justify-end gap-2">
          <button
            type="button"
            class="rounded-md border px-3 py-1.5 text-sm"
            @click="closeEdit"
          >
            Cancel
          </button>
          <button
            class="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
            :disabled="store.loading"
          >
            <span v-if="!store.loading">Save</span>
            <span v-else class="inline-flex items-center gap-2">
              <Iconify icon="eos-icons:loading" class="h-4 w-4 animate-spin" />
              Saving…
            </span>
          </button>
        </div>
      </form>
    </div>
  </Teleport>
</template>
