<script setup lang="ts">
import { useLoading } from "~/composables/useLoading";

const _controller = useLoading();
</script>

<template>
  <div v-show="_controller.isLoading" class="overlay"></div>

  <div v-show="_controller.isLoading" class="modal-wrapper">
    <div class="loader">
      <!-- <div class="loader-text"></div> -->
    </div>
  </div>
</template>

<style scoped>
.animate-flip {
  animation: flip 2s infinite;
}

@keyframes flip {
  0% {
    transform: rotateY(0);
  }
  100% {
    transform: rotateY(360deg);
  }
}
</style>
