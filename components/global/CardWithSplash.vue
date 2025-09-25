<script setup>
import { ref, onMounted } from "vue";
import gsap from "gsap";

// State untuk splash screen dalam card
const showSplash = ref(true);

onMounted(() => {
  // Efek animasi GSAP untuk splash dalam card
  gsap.to(".splash-card", {
    opacity: 0,
    duration: 1.5,
    delay: 1,
    onComplete: () => {
      showSplash.value = false;
    },
  });
});
</script>

<template>
  <div class="card-container">
    <!-- Card -->
    <div class="card bg-white shadow-lg rounded-2xl p-6 relative overflow-hidden w-80">
      <!-- Splash Screen di dalam Card -->
      <div
        v-if="showSplash"
        class="splash-card absolute inset-0 flex items-center justify-center bg-blue-500 text-white text-lg font-bold z-10"
      >
        Loading...
      </div>

      <!-- Card Content -->
      <div v-show="!showSplash" class="content transition-opacity duration-500">
        <h2 class="text-xl font-semibold mb-2">Card Title</h2>
        <p class="text-gray-600">
          This is a card component with an internal splash screen.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f3f4f6;
}
</style>
