<script setup lang="ts">
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - [PROJECT_NAME]` : "[PROJECT_NAME]";
  },
});
</script>

<template>
  <Loading />
  <Snackbar />
  <Dialog />

  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
