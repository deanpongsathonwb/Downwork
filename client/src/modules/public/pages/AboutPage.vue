<template>
  <div>
    <section class="bg-gradient-to-br from-slate-900 to-green-950 text-white py-20 px-4">
      <div class="max-w-3xl mx-auto text-center">
        <h1 class="text-5xl font-black mb-4">About Downwork</h1>
        <p class="text-xl text-slate-300">Connecting top talent with forward-thinking companies.</p>
      </div>
    </section>
    <section class="max-w-4xl mx-auto px-4 py-16 space-y-12">
      <div>
        <h2 class="text-2xl font-bold text-slate-900 mb-4">Our Mission</h2>
        <p class="text-slate-600 leading-relaxed text-lg">Downwork exists to create economic opportunity for every professional on the planet. We believe the future of work is flexible, global, and built on trust.</p>
      </div>
      <div class="grid md:grid-cols-3 gap-6">
        <div v-for="stat in stats" :key="stat.label" class="text-center bg-white rounded-2xl border border-slate-200 p-6">
          <p class="text-4xl font-black text-green-600 mb-2">{{ stat.value }}</p>
          <p class="text-slate-600 text-sm">{{ stat.label }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const stats = [
  { value: '2M+', label: 'Registered Users' },
  { value: '180+', label: 'Countries Served' },
  { value: '$50M+', label: 'Paid to Freelancers' },
]
</script>
