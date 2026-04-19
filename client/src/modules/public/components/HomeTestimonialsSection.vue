<template>
  <section
    class="relative overflow-hidden bg-white py-16 md:py-20"
    aria-labelledby="testimonials-heading"
  >
    <div
      class="pointer-events-none absolute inset-0 z-0 flex items-center justify-center text-green-600/20"
      aria-hidden="true"
    >
      <svg
        class="w-[min(140%,80rem)] min-w-[56rem] shrink-0 -translate-y-[8%]"
        viewBox="0 0 1200 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="currentColor"
          d="M0 120C200 40 400 200 600 100C800 0 1000 180 1200 90V280H0V120Z"
        />
        <path
          fill="currentColor"
          fill-opacity="0.55"
          d="M0 165C250 85 450 215 700 125C850 70 1000 195 1200 130V280H0V165Z"
        />
      </svg>
    </div>

    <div class="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h2 id="testimonials-heading" class="mb-12 text-3xl font-bold text-slate-900 md:text-4xl">
        Proven results on Downwork
      </h2>

      <ul class="m-0 grid list-none grid-cols-1 gap-8 p-0 md:grid-cols-3">
        <li v-for="item in testimonials" :key="item.name">
          <blockquote
            class="flex h-full flex-col justify-between rounded-[2rem] border border-slate-100/90 bg-white p-8 shadow-sm"
          >
            <p class="font-medium leading-relaxed text-slate-900">
              “{{ item.quote }}”
            </p>
            <footer class="mt-8 flex items-end justify-between gap-4">
              <div class="min-w-0">
                <cite class="not-italic font-bold text-slate-900">
                  {{ item.name }}, {{ item.role }}
                </cite>
                <p class="mt-1 text-sm text-slate-500">
                  {{ item.company }}
                </p>
              </div>
              <img
                :src="item.avatarSrc"
                :alt="`${item.name}, ${item.company}`"
                width="56"
                height="56"
                class="h-14 w-14 shrink-0 rounded-full object-cover ring-1 ring-slate-100"
                loading="lazy"
              />
            </footer>
          </blockquote>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
const testimonials = [
  {
    quote:
      'We discovered CTO-level expertise in days, not months. The talent quality on Downwork changed how we scale engineering.',
    name: 'Saswata Basu',
    role: 'CEO',
    company: 'Züs',
    avatarSrc: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=112&h=112&fit=crop',
  },
  {
    quote:
      "Downwork isn't just a hiring platform — it's where we build long-term relationships with specialists who ship.",
    name: 'David Wrench',
    role: 'Co-Founder and CEO',
    company: 'Datajoi',
    avatarSrc: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=112&h=112&fit=crop',
  },
  {
    quote:
      'I found two awesome candidates within a week. Clear profiles and honest reviews made shortlisting painless.',
    name: 'Matt See',
    role: 'Co-Founder and CEO',
    company: 'Lighthouse',
    avatarSrc: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=112&h=112&fit=crop',
  },
  {
    quote:
      'Downwork is paramount to how we deliver client work on time. Reliable freelancers and streamlined contracts keep us moving.',
    name: 'Bryan Goltzman',
    role: 'CEO',
    company: 'Liquid Screen Design',
    avatarSrc: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=112&h=112&fit=crop',
  },
  {
    quote:
      'In this early stage we really need flexible help. Downwork let us plug in experts without committing to full-time hires.',
    name: 'Jen Libby',
    role: 'Founder and CEO',
    company: 'Promly',
    avatarSrc: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=112&h=112&fit=crop',
  },
  {
    quote:
      'The safety features are nice — milestones and transparent messaging gave our team confidence on every engagement.',
    name: 'Gabriel Richman',
    role: 'Founder and CEO',
    company: 'Omic',
    avatarSrc: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=112&h=112&fit=crop',
  },
] as const
</script>
