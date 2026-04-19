<template>
  <div class="relative flex min-h-dvh flex-col overflow-x-hidden bg-white text-neutral-900">
    <PublicNavbar />
    <div
      class="pointer-events-none absolute inset-0 text-slate-200/80"
      aria-hidden="true"
    >
      <svg class="absolute -left-24 top-0 h-[420px] w-[420px]" viewBox="0 0 400 400" fill="none">
        <path
          d="M40 120c80-100 220-80 280 20s20 220-80 280"
          stroke="currentColor"
          stroke-width="1.25"
        />
        <path
          d="M120 360c120-40 200-200 160-320"
          stroke="currentColor"
          stroke-width="1"
          opacity="0.7"
        />
      </svg>
      <svg
        class="absolute -right-16 bottom-0 h-[380px] w-[380px]"
        viewBox="0 0 400 400"
        fill="none"
      >
        <path
          d="M360 280c-60 100-200 120-280 40S20 80 120 40"
          stroke="currentColor"
          stroke-width="1.25"
        />
      </svg>
    </div>
    <div
      class="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-start px-6 pb-16 pt-20 text-center antialiased sm:pt-28 md:pt-36"
    >
      <div class="mb-8 shrink-0 sm:mb-10" aria-hidden="true">
        <svg
          class="mx-auto h-[140px] w-[120px] drop-shadow-sm sm:h-[160px] sm:w-[136px]"
          viewBox="0 0 136 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <!-- Cork / board -->
          <rect
            x="12"
            y="28"
            width="112"
            height="124"
            rx="6"
            fill="#14532d"
            stroke="#4ade80"
            stroke-width="2"
          />
          <!-- Paper -->
          <rect x="26" y="42" width="84" height="98" rx="3" fill="white" stroke="#e5e5e5" stroke-width="1" />
          <!-- Pin -->
          <ellipse cx="34" cy="46" rx="7" ry="5" fill="#f472b6" />
          <ellipse cx="33" cy="44" rx="3" ry="2" fill="#fce7f3" opacity="0.9" />
          <path d="M34 51v12" stroke="#db2777" stroke-width="2" stroke-linecap="round" />
          <!-- JOB POST -->
          <text
            x="68"
            y="68"
            text-anchor="middle"
            fill="#14a800"
            font-size="11"
            font-weight="700"
            font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
          >
            JOB POST
          </text>
          <!-- Text lines -->
          <rect x="36" y="78" width="64" height="3" rx="1" fill="#14a800" opacity="0.35" />
          <rect x="36" y="88" width="58" height="3" rx="1" fill="#14a800" opacity="0.28" />
          <rect x="36" y="98" width="62" height="3" rx="1" fill="#14a800" opacity="0.28" />
          <rect x="36" y="108" width="52" height="3" rx="1" fill="#14a800" opacity="0.22" />
        </svg>
      </div>
      <div
        class="flex w-full max-w-full justify-center overflow-x-auto px-4"
      >
        <p
          class="whitespace-nowrap text-center text-2xl font-normal leading-tight tracking-tight text-neutral-900 sm:text-3xl"
        >
          We can't wait to post your job! Please verify your email and phone.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PublicNavbar from '@/components/layout/PublicNavbar.vue'
</script>
