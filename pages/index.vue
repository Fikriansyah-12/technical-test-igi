<script setup lang="ts">
const logout = () => {
  navigateTo("/auth/logout");
};
definePageMeta({
  layout: "admin",
});
</script>
<template>
  <Breadcrump
    :items="[
      { label: 'Produk', to: '/admin/produk' },
      { label: 'Tambah Produk', to: '/admin/produk/tambah' },
      { label: 'Informasi Dasar' }, // current
    ]"
    variant="admin"
  />

    <div class="p-2">Konten Dashboard Admin</div>
  <!-- <AppNavbar
    role="admin"
    :cart-count="3"
    :is-authenticated="true"
    @search="(q: any) => navigateTo(`/search?q=${encodeURIComponent(q)}`)"
    @logout="logout()"
  />
  <NuxtPage /> -->
</template>
