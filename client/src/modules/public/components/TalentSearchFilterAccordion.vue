<template>
  <details class="group border-b border-neutral-200 py-3">
    <summary
      class="flex cursor-pointer list-none items-center justify-between gap-2 text-sm font-semibold text-neutral-900 [&::-webkit-details-marker]:hidden"
    >
      {{ title }}
      <svg
        class="h-4 w-4 shrink-0 text-neutral-500 transition-transform group-open:rotate-180"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </summary>
    <div class="mt-3 space-y-2">
      <slot />
    </div>
  </details>
</template>

<script setup lang="ts">
defineProps<{ title: string }>()
</script>
