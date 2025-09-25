<template>
  <section id="navbar">
    <Navbar
      class="bg-[#0f0f0f] text-white py-4 mb-2 flex justify-between items-center container"
    >
      <div class="py-5">
        <img src="~/assets/images/logo/halos.svg" alt="Halos Logo" class="h-8 w-24" />
      </div>
      <ul class="flex gap-6">
        <li class="relative group">
          <a href="#" class="flex items-center text-sm font-light tracking-wide">
            MANAGEMENT <span class="ml-2 transition-transform text-xl">+</span>
          </a>
        </li>
        <li class="relative group">
          <a href="#" class="flex items-center text-sm font-light tracking-wide">
            ENTERTAINMENT
            <span class="ml-2 transition-transform text-xl">+</span>
          </a>
        </li>
        <li><a class="text-sm font-light tracking-wide" href="#">ABOUT</a></li>
        <li>
          <a class="text-sm font-light tracking-wide" href="#">CONTACT US</a>
        </li>
        <li>
          <a class="text-sm font-light tracking-wide" href="#">PORTFOLIO</a>
        </li>
        <li><a class="text-sm font-light tracking-wide" href="#">ARTICLE</a></li>
        <li><a class="text-sm font-light tracking-wide" href="#">MERCH</a></li>
      </ul>
    </Navbar>
  </section>
</template>

<script setup lang="ts">
// import { ref } from "vue";

// const isHovered = ref(false);
</script>
