<template>
  <svg
    class="h-10 w-10 shrink-0 text-[#1dbf73]"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <!-- AI Services — atom / nodes -->
    <template v-if="name === 'ai'">
      <circle cx="12" cy="12" r="2" />
      <path d="M12 4v2M12 18v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M4 12h2M18 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" />
      <path d="M8.5 8.5l1.2 1.2M14.3 14.3l1.2 1.2M15.5 8.5l-1.2 1.2M9.3 14.3l-1.2 1.2" />
    </template>
    <!-- Development & IT — </> -->
    <template v-else-if="name === 'development'">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </template>
    <!-- Design & Creative — palette -->
    <template v-else-if="name === 'design'">
      <path
        d="M12 20c-4.4 0-8-3-8-8s4-8 8-8 8 3.5 8 8c0 2.5-2 4-3.5 4s-2.5-1.5-2.5-3c0-1 .5-2 2-2s2.5 1 2.5 3z"
      />
      <circle cx="7.5" cy="11" r="0.75" stroke="currentColor" fill="none" />
      <circle cx="10" cy="8" r="0.75" stroke="currentColor" fill="none" />
      <circle cx="14" cy="8" r="0.75" stroke="currentColor" fill="none" />
    </template>
    <!-- Sales & Marketing — handshake simplified -->
    <template v-else-if="name === 'sales'">
      <path d="M7 11V9a2 2 0 012-2h1l2 2h3a2 2 0 012 2v5h-3" />
      <path d="M7 15h2l1.5 1.5a2 2 0 002.8 0L15 15h3" />
      <path d="M7 11v8l3-2 1 1h4l2-3v-4" />
    </template>
    <!-- Writing & Translation — pen nib -->
    <template v-else-if="name === 'writing'">
      <path d="M12 19l-7-7 8-8 7 7-8 8z" />
      <path d="M5 12l7-7" />
      <path d="M10 14l2 2" />
    </template>
    <!-- Admin & Support — desk / user -->
    <template v-else-if="name === 'admin'">
      <path d="M4 19h16" />
      <path d="M8 17V9h8v8" />
      <path d="M8 13h8" />
      <circle cx="12" cy="6" r="2.5" />
    </template>
    <!-- Finance & Accounting — bank columns -->
    <template v-else-if="name === 'finance'">
      <path d="M4 19h16V8l-8-4-8 4v11z" />
      <path d="M9 19v-4h6v4" />
      <path d="M9 11h6" />
      <path d="M12 8v3" />
    </template>
    <!-- Legal — scales -->
    <template v-else-if="name === 'legal'">
      <path d="M12 3v3" />
      <path d="M5 6h14" />
      <path d="M7 6l-2 9a2 2 0 104 0L7 6z" />
      <path d="M17 6l-2 9a2 2 0 104 0l-2-9z" />
      <path d="M12 15v6" />
    </template>
    <!-- HR & Training — two people -->
    <template v-else-if="name === 'hr'">
      <circle cx="9" cy="7" r="2.5" />
      <path d="M4 19v-1a4 4 0 014-4" />
      <circle cx="16" cy="8" r="2" />
      <path d="M14 19v-1a3 3 0 013-3 3 3 0 016 0" />
    </template>
    <!-- Engineering & Architecture — wrench + tool -->
    <template v-else-if="name === 'engineering'">
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l2.3-2.3a6 6 0 01-8.4 8.4l-6.3 6.3a2.1 2.1 0 11-3-3l6.3-6.3a6 6 0 018.1-7.1z" />
      <path d="M5 3l4 4" />
    </template>
  </svg>
</template>

<script setup lang="ts">
import type { HomeCategoryIconId } from '@/constants/categories'

defineProps<{ name: HomeCategoryIconId }>()
</script>
