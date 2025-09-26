<template>
  <section class="rounded-2xl border border-gray-200 bg-white p-4 mb-4 shadow-sm">
    <header class="mb-3 flex items-center justify-between">
      <h3 class="text-sm font-medium"><slot name="title">Section</slot></h3>
      <div class="flex items-center gap-2"><slot name="actions" /></div>
    </header>
    <div><slot /></div>
  </section>
</template>
