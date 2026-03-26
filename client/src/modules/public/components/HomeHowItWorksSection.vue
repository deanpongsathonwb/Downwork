<template>
  <section class="py-20 bg-slate-900 text-white" aria-labelledby="how-it-works-heading">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 id="how-it-works-heading" class="text-3xl font-bold mb-3">How It Works</h2>
        <p class="text-slate-400">Simple, transparent, and secure</p>
      </div>
      <ol class="grid md:grid-cols-3 gap-8 list-none">
        <li v-for="(step, i) in steps" :key="step.title" class="text-center">
          <div
            class="w-14 h-14 bg-green-500/20 border border-green-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4"
            aria-hidden="true"
          >
            <span class="text-2xl font-black text-green-400">{{ i + 1 }}</span>
          </div>
          <h3 class="text-lg font-semibold mb-2">{{ step.title }}</h3>
          <p class="text-slate-400 text-sm leading-relaxed">{{ step.description }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Step { title: string; description: string }
defineProps<{ steps: readonly Step[] }>()
</script>
