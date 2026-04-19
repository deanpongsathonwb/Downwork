<template>
  <header
    ref="publicHeaderRef"
    class="sticky top-0 z-50 bg-white max-[991.98px]:border-b max-[991.98px]:border-slate-200"
    :class="{ 'border-b border-slate-200': !isHomePage && !isClientWorkspaceHeader }"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-stretch h-16">
        <!-- Mobile menu toggle (left, before logo) -->
        <div class="-ml-2 mr-1 flex shrink-0 items-center min-[992px]:hidden sm:-ml-4">
          <button
            type="button"
            class="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg p-2 text-slate-950 hover:bg-slate-100"
            :aria-expanded="mobileMenuOpen"
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <svg class="h-7 w-7 shrink-0" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        <!-- Logo -->
        <div class="flex items-center shrink-0">
          <AppLogo size="md" />
        </div>

        <!-- Desktop Nav Links (client job flow — hover dropdowns) -->
        <nav v-if="isClientWorkspaceHeader" class="hidden min-[992px]:flex flex-1 items-stretch gap-6 ml-10" aria-label="Main navigation">
          <div
            class="relative flex cursor-pointer items-center"
            @mouseenter="clientWorkspaceNavMenu = 'hire'"
            @mouseleave="clientWorkspaceNavMenu = null"
          >
            <button
              type="button"
              class="inline-flex cursor-pointer items-center gap-1 rounded-md px-1 py-2 text-sm font-medium transition-colors"
              :class="
                clientWorkspaceNavMenu === 'hire'
                  ? 'text-slate-500'
                  : 'text-slate-800 hover:text-slate-900'
              "
              :aria-expanded="clientWorkspaceNavMenu === 'hire'"
              aria-haspopup="true"
            >
              Hire talent
              <span class="inline-flex h-4 w-4 shrink-0 items-center justify-center" aria-hidden="true">
                <svg
                  v-if="clientWorkspaceNavMenu !== 'hire'"
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 9l6 6 6-6" />
                </svg>
                <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 15l6-6 6 6" />
                </svg>
              </span>
            </button>
            <transition name="menu-fade">
              <div
                v-if="clientWorkspaceNavMenu === 'hire'"
                class="absolute left-0 top-full z-50 min-w-[15.5rem] pt-1.5"
              >
                <div class="rounded-xl border border-slate-200 bg-white py-2 text-left shadow-lg">
                  <p class="px-4 pb-1 pt-1 text-[11px] font-medium uppercase tracking-wide text-slate-500">
                    Manage jobs and offers
                  </p>
                  <RouterLink
                    :to="{ name: 'client-jobs' }"
                    class="block px-4 py-2 text-[15px] text-slate-900 hover:bg-slate-50"
                    @click="clientWorkspaceNavMenu = null"
                  >
                    Job posts and proposals
                  </RouterLink>
                  <a
                    href="#"
                    class="block px-4 py-2 text-[15px] text-slate-900 hover:bg-slate-50"
                    @click.prevent
                  >
                    Pending offers
                  </a>
                  <p class="mt-2 border-t border-slate-100 px-4 pb-1 pt-3 text-[11px] font-medium uppercase tracking-wide text-slate-500">
                    Find freelancers
                  </p>
                  <RouterLink
                    :to="{ name: 'client-job-post-instant-welcome' }"
                    class="block px-4 py-2 text-[15px] text-slate-900 hover:bg-slate-50"
                    @click="clientWorkspaceNavMenu = null"
                  >
                    Post a job
                  </RouterLink>
                  <RouterLink
                    :to="{ name: 'talent-search' }"
                    class="block px-4 py-2 text-[15px] text-slate-900 hover:bg-slate-50"
                    @click="clientWorkspaceNavMenu = null"
                  >
                    Search for talent
                  </RouterLink>
                  <a href="#" class="block px-4 py-2 text-[15px] text-slate-900 hover:bg-slate-50" @click.prevent>
                    Talent you’ve hired
                  </a>
                  <a href="#" class="block px-4 py-2 text-[15px] text-slate-900 hover:bg-slate-50" @click.prevent>
                    Talent you’ve saved
                  </a>
                  <RouterLink
                    :to="{ name: 'client-contracts' }"
                    class="block px-4 py-2 text-[15px] text-slate-900 hover:bg-slate-50"
                    @click="clientWorkspaceNavMenu = null"
                  >
                    Direct contracts
                  </RouterLink>
                </div>
              </div>
            </transition>
          </div>

          <div
            class="relative flex cursor-pointer items-center"
            @mouseenter="clientWorkspaceNavMenu = 'manage'"
            @mouseleave="clientWorkspaceNavMenu = null"
          >
            <button
              type="button"
              class="inline-flex cursor-pointer items-center gap-1 rounded-md px-1 py-2 text-sm font-medium transition-colors"
              :class="
                clientWorkspaceNavMenu === 'manage'
                  ? 'text-slate-500'
                  : 'text-slate-800 hover:text-slate-900'
              "
              :aria-expanded="clientWorkspaceNavMenu === 'manage'"
              aria-haspopup="true"
            >
              Manage work
              <span class="inline-flex h-4 w-4 shrink-0 items-center justify-center" aria-hidden="true">
                <svg
                  v-if="clientWorkspaceNavMenu !== 'manage'"
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 9l6 6 6-6" />
                </svg>
                <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 15l6-6 6 6" />
                </svg>
              </span>
            </button>
            <transition name="menu-fade">
              <div
                v-if="clientWorkspaceNavMenu === 'manage'"
                class="absolute left-0 top-full z-50 min-w-[15.5rem] pt-1.5"
              >
                <div class="rounded-xl border border-slate-200 bg-white py-2 text-left shadow-lg">
                  <p class="px-4 pb-1 pt-1 text-[11px] font-medium uppercase tracking-wide text-slate-500">
                    Active and past work
                  </p>
                  <RouterLink
                    :to="{ name: 'client-contracts' }"
                    class="block px-4 py-2 text-[15px] text-slate-900 hover:bg-slate-50"
                    @click="clientWorkspaceNavMenu = null"
                  >
                    Your contracts
                  </RouterLink>
                  <p class="mt-2 border-t border-slate-100 px-4 pb-1 pt-3 text-[11px] font-medium uppercase tracking-wide text-slate-500">
                    Hourly contract activity
                  </p>
                  <a href="#" class="block px-4 py-2 text-[15px] text-slate-900 hover:bg-slate-50" @click.prevent>Timesheets</a>
                  <a href="#" class="block px-4 py-2 text-[15px] text-slate-900 hover:bg-slate-50" @click.prevent>Time by freelancer</a>
                  <a href="#" class="block px-4 py-2 text-[15px] text-slate-900 hover:bg-slate-50" @click.prevent>Work diaries</a>
                  <a href="#" class="block px-4 py-2 text-[15px] text-slate-900 hover:bg-slate-50" @click.prevent>Custom export</a>
                </div>
              </div>
            </transition>
          </div>

          <div
            class="relative flex cursor-pointer items-center"
            @mouseenter="clientWorkspaceNavMenu = 'reports'"
            @mouseleave="clientWorkspaceNavMenu = null"
          >
            <button
              type="button"
              class="inline-flex cursor-pointer items-center gap-1 rounded-md px-1 py-2 text-sm font-medium transition-colors"
              :class="
                clientWorkspaceNavMenu === 'reports'
                  ? 'text-slate-500'
                  : 'text-slate-800 hover:text-slate-900'
              "
              :aria-expanded="clientWorkspaceNavMenu === 'reports'"
              aria-haspopup="true"
            >
              Reports
              <span class="inline-flex h-4 w-4 shrink-0 items-center justify-center" aria-hidden="true">
                <svg
                  v-if="clientWorkspaceNavMenu !== 'reports'"
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 9l6 6 6-6" />
                </svg>
                <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 15l6-6 6 6" />
                </svg>
              </span>
            </button>
            <transition name="menu-fade">
              <div
                v-if="clientWorkspaceNavMenu === 'reports'"
                class="absolute left-0 top-full z-50 min-w-[15.5rem] pt-1.5"
              >
                <div class="rounded-xl border border-slate-200 bg-white py-2 text-left shadow-lg">
                  <a href="#" class="block px-4 py-2 text-[15px] text-slate-900 hover:bg-slate-50" @click.prevent>
                    Weekly financial summary
                  </a>
                  <RouterLink
                    :to="{ name: 'client-payments' }"
                    class="block px-4 py-2 text-[15px] text-slate-900 hover:bg-slate-50"
                    @click="clientWorkspaceNavMenu = null"
                  >
                    Transaction history
                  </RouterLink>
                  <a href="#" class="block px-4 py-2 text-[15px] text-slate-900 hover:bg-slate-50" @click.prevent>
                    Spending by activity
                  </a>
                </div>
              </div>
            </transition>
          </div>

          <RouterLink
            :to="messagesRoute"
            class="inline-flex cursor-pointer items-center self-center rounded-md px-1 py-2 text-sm font-medium text-slate-800 hover:text-slate-900"
          >
            Messages
          </RouterLink>
        </nav>
        <nav v-else class="hidden min-[992px]:flex flex-1 items-stretch gap-1 ml-10" aria-label="Main navigation">
          <div class="flex h-full items-center">
            <div
              class="relative"
              @mouseenter="hireMenuOpen = true"
              @mouseleave="hireMenuOpen = false"
            >
              <button
                type="button"
                class="px-3 py-2 text-sm font-medium rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                :class="hireMenuOpen ? 'text-green-600' : 'text-slate-600 hover:text-slate-900'"
                aria-haspopup="true"
                :aria-expanded="hireMenuOpen"
                @focus="hireMenuOpen = true"
              >
                Hire freelancers
                <svg
                  class="w-4 h-4 shrink-0 transition-transform duration-200 ease-out"
                  :class="{ 'rotate-180': hireMenuOpen }"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7" />
                </svg>
              </button>
              <!-- Fills header strip below trigger so moving down never hits a dead zone -->
              <div class="absolute left-0 right-0 top-full h-5" aria-hidden="true" />

            <transition name="menu-fade">
              <div
                v-if="hireMenuOpen"
                class="mega-menu-panel fixed left-0 right-0 top-16 z-50 border-t border-slate-200 bg-white py-6 shadow-[0_12px_32px_-16px_rgba(15,23,42,0.1)]"
              >
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                  <div class="grid grid-cols-4 gap-x-8">
                    <section
                      v-for="section in HIRE_FREELANCER_MENU.topSections"
                      :key="section.title"
                    >
                      <h3 class="text-[15px] font-semibold text-slate-800 mb-3">
                        {{ section.title }}
                      </h3>
                      <ul class="space-y-2">
                        <li
                          v-for="item in section.items"
                          :key="item.to"
                        >
                          <RouterLink :to="item.to" class="text-[15px] text-slate-600 hover:text-slate-900 transition-colors">
                            {{ item.label }}
                          </RouterLink>
                        </li>
                      </ul>
                    </section>
                  </div>

                  <div class="grid grid-cols-4 gap-x-8">
                    <section
                      v-for="section in HIRE_FREELANCER_MENU.bottomSections"
                      :key="section.title"
                    >
                      <h3 class="text-[15px] font-semibold text-slate-800 mb-3">
                        {{ section.title }}
                      </h3>
                      <ul class="space-y-2">
                        <li
                          v-for="item in section.items"
                          :key="item.to"
                        >
                          <RouterLink :to="item.to" class="text-[15px] text-slate-600 hover:text-slate-900 transition-colors">
                            {{ item.label }}
                          </RouterLink>
                        </li>
                      </ul>
                    </section>

                    <section>
                      <ul class="space-y-4 pt-1">
                        <li
                          v-for="cta in HIRE_FREELANCER_MENU.ctas"
                          :key="cta"
                        >
                          <a
                            href="#"
                            class="text-[15px] font-semibold text-green-600 underline-offset-2 hover:text-green-700 hover:underline transition-colors"
                            @click.prevent
                          >
                            {{ cta }} →
                          </a>
                        </li>
                      </ul>
                    </section>
                  </div>
                </div>
              </div>
            </transition>
            </div>
          </div>

          <div class="flex h-full items-center">
            <div
              class="relative"
              @mouseenter="findWorkMenuOpen = true"
              @mouseleave="findWorkMenuOpen = false"
            >
              <button
                type="button"
                class="px-3 py-2 text-sm font-medium rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                :class="findWorkMenuOpen ? 'text-green-600' : 'text-slate-600 hover:text-slate-900'"
                aria-haspopup="true"
                :aria-expanded="findWorkMenuOpen"
                @focus="findWorkMenuOpen = true"
              >
                Find work
                <svg
                  class="w-4 h-4 shrink-0 transition-transform duration-200 ease-out"
                  :class="{ 'rotate-180': findWorkMenuOpen }"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7" />
                </svg>
              </button>
              <div class="absolute left-0 right-0 top-full h-5" aria-hidden="true" />

            <transition name="menu-fade">
              <div
                v-if="findWorkMenuOpen"
                class="mega-menu-panel fixed left-0 right-0 top-16 z-50 border-t border-slate-200 bg-white py-6 shadow-[0_12px_32px_-16px_rgba(15,23,42,0.1)]"
              >
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-4 gap-x-8 gap-y-8">
                  <section
                    v-for="section in FIND_WORK_MENU.sections"
                    :key="section.title"
                  >
                    <h3 class="text-[15px] font-semibold text-slate-800 mb-3">
                      {{ section.title }}
                    </h3>
                    <ul class="space-y-2">
                      <li
                        v-for="item in section.items"
                        :key="item.label"
                      >
                        <RouterLink
                          :to="item.to"
                          class="text-[15px] text-slate-600 hover:text-slate-900 transition-colors"
                        >
                          {{ item.label }}
                        </RouterLink>
                      </li>
                    </ul>
                  </section>

                  <section>
                    <ul class="space-y-4 pt-1">
                      <li
                        v-for="cta in FIND_WORK_MENU.ctas"
                        :key="cta"
                      >
                        <a
                          href="#"
                          class="text-[15px] font-semibold text-green-600 underline-offset-2 hover:text-green-700 hover:underline transition-colors"
                          @click.prevent
                        >
                          {{ cta }} →
                        </a>
                      </li>
                    </ul>
                  </section>
                </div>
              </div>
            </transition>
            </div>
          </div>

          <RouterLink
            :to="{ name: 'pricing' }"
            class="inline-flex items-center h-full px-3 py-2 text-sm font-medium rounded-lg transition-colors"
            :class="
              isPricingActive
                ? 'text-green-600 hover:text-green-700'
                : 'text-slate-600 hover:text-green-600'
            "
          >
            Pricing
          </RouterLink>
        </nav>

        <!-- Auth Actions -->
        <div class="ml-auto flex shrink-0 items-center gap-3">
          <form
            v-if="showHeaderSearch"
            class="hidden min-[1080px]:flex items-center mr-2"
            role="search"
            @submit.prevent="handleStickySearch"
          >
            <div class="w-[340px] border border-slate-300 rounded-xl h-10 flex items-center bg-white">
              <div
                class="h-10 flex-1 min-w-0 flex items-center rounded-l-xl border-2 border-transparent transition-colors"
                :class="
                  stickyTypeMenuOpen ? '' : 'hover:border-slate-500 focus-within:border-slate-500'
                "
              >
                <svg class="w-5 h-5 text-slate-500 ml-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  id="public-navbar-sticky-search"
                  v-model="stickySearchQuery"
                  type="text"
                  name="q"
                  class="w-full text-sm text-slate-700 bg-transparent outline-none px-3"
                  placeholder="Search"
                  autocomplete="off"
                  aria-label="Search"
                  @focus="stickySearchFieldFocused = true"
                  @blur="stickySearchFieldFocused = false"
                />
              </div>
              <div class="ml-auto h-full flex items-center shrink-0">
                <div class="h-5 w-px bg-slate-300"></div>
                <div
                  ref="stickyTypeDropdownRef"
                  class="relative h-full shrink-0"
                >
                  <button
                    type="button"
                    class="h-full inline-flex items-center gap-1 whitespace-nowrap text-sm text-slate-700 pl-3 pr-2 rounded-r-xl border-2 transition-colors cursor-pointer"
                    :class="
                      stickyTypeMenuOpen
                        ? 'border-slate-500'
                        : stickySearchFieldFocused
                          ? 'border-transparent'
                          : 'border-transparent hover:border-slate-500'
                    "
                    aria-haspopup="menu"
                    :aria-expanded="stickyTypeMenuOpen"
                    aria-label="Search type"
                    @click.stop="stickyTypeMenuOpen = !stickyTypeMenuOpen"
                  >
                    <span>{{ selectedStickyType.label }}</span>
                    <svg class="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7" />
                    </svg>
                  </button>

                  <div
                    v-if="stickyTypeMenuOpen"
                    class="z-50 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-xl"
                    :class="headerHasBottomBorder ? 'fixed' : 'absolute left-0 top-11'"
                    :style="headerHasBottomBorder ? stickyDropdownFixedStyle : undefined"
                    role="menu"
                  >
                    <button
                      v-for="option in STICKY_SEARCH_OPTIONS"
                      :key="option.value"
                      type="button"
                      class="w-full flex items-start gap-3 text-left rounded-lg px-3 py-2 hover:bg-slate-50 cursor-pointer"
                      role="menuitem"
                      @click="selectStickySearchType(option.value)"
                    >
                      <svg v-if="option.value === 'talent'" class="w-5 h-5 mt-0.5 text-slate-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M17 20h5v-1a4 4 0 00-5.33-3.78M17 20H7m10 0v-1c0-.65-.13-1.27-.36-1.84M7 20H2v-1a4 4 0 015.33-3.78M7 20v-1c0-.65.13-1.27.36-1.84m0 0a5 5 0 019.28 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <svg v-else-if="option.value === 'projects'" class="w-5 h-5 mt-0.5 text-slate-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 7h5l2 2h11v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M8 13h8M8 17h5" />
                      </svg>
                      <svg v-else class="w-5 h-5 mt-0.5 text-slate-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <rect x="3" y="5" width="18" height="16" rx="2" stroke-width="1.8" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M16 3v4M8 3v4M3 10h18" />
                      </svg>
                      <span class="min-w-0">
                        <span class="block text-[15px] font-medium text-slate-900">{{ option.label }}</span>
                        <span class="block text-xs text-slate-500 truncate">{{ option.description }}</span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>

          <template v-if="!auth.isAuthenticated">
            <RouterLink
              to="/auth/login"
              class="hidden min-[992px]:inline text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
              :class="guestLoginReorderClass"
            >
              Log in
            </RouterLink>
            <RouterLink
              to="/auth/signup"
              class="text-sm font-medium transition-colors min-[992px]:inline-flex min-[992px]:items-center min-[992px]:rounded-lg min-[992px]:bg-green-600 min-[992px]:px-4 min-[992px]:py-2 min-[992px]:font-medium min-[992px]:text-white min-[992px]:hover:bg-green-700 min-[992px]:hover:text-white"
              :class="[signupAuthNarrowClass, guestSignupReorderClass]"
            >
              Sign up
            </RouterLink>
            <span
              v-if="showHeaderSearch"
              class="inline-flex min-h-10 min-w-10 shrink-0 cursor-default items-center justify-center rounded-lg text-slate-800 min-[1080px]:hidden"
              :class="guestCompactSearchReorderClass"
              aria-hidden="true"
            >
              <svg class="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
          </template>
          <template v-else>
            <div v-if="isClientWorkspaceHeader" ref="closeAccountActionsRef" class="flex items-center gap-2.5">
              <RouterLink
                v-if="auth.isClient"
                :to="{ name: 'client-job-post-instant-welcome' }"
                class="mr-0.5 hidden shrink-0 items-center justify-center rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700 sm:inline-flex"
              >
                Post a Job
              </RouterLink>
              <div
                class="relative group"
                @mouseenter="handleIconMouseEnter('help')"
                @mouseleave="handleIconMouseLeave('help')"
                @mousedown="handleIconMouseDown"
              >
                <button
                  type="button"
                  class="rounded-full p-1.5 text-slate-700 transition-colors hover:bg-slate-100 cursor-pointer"
                  aria-label="Help"
                  @click.stop="toggleCloseAccountDropdown('help')"
                >
                  <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.23 9a3.75 3.75 0 1 1 7.5 0c0 2.25-3 2.625-3 4.5m0 3h.008M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                  </svg>
                </button>
                <span
                  v-if="shouldShowIconTooltip('help')"
                  class="pointer-events-none absolute left-1/2 top-full z-[70] mt-3 -translate-x-1/2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm"
                >
                  Help
                  <span class="absolute -top-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-l border-t border-slate-200 bg-white"></span>
                </span>
                <div
                  v-if="closeAccountDropdownOpen === 'help'"
                  class="absolute right-0 top-full z-50 mt-3 w-56 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg"
                >
                  <ul class="space-y-2 text-sm text-slate-900">
                    <li><a href="#" class="block cursor-pointer rounded-lg px-2 py-1.5 hover:bg-slate-50" @click.prevent>Help center</a></li>
                    <li><a href="#" class="block cursor-pointer rounded-lg px-2 py-1.5 hover:bg-slate-50" @click.prevent>Support requests</a></li>
                    <li><a href="#" class="block cursor-pointer rounded-lg px-2 py-1.5 hover:bg-slate-50" @click.prevent>What's new</a></li>
                    <li><a href="#" class="block cursor-pointer rounded-lg px-2 py-1.5 hover:bg-slate-50" @click.prevent>Release notes</a></li>
                  </ul>
                </div>
              </div>
              <div
                class="relative group"
                @mouseenter="handleIconMouseEnter('notifications')"
                @mouseleave="handleIconMouseLeave('notifications')"
                @mousedown="handleIconMouseDown"
              >
                <button
                  type="button"
                  class="rounded-full p-1.5 text-slate-700 transition-colors hover:bg-slate-100 cursor-pointer"
                  aria-label="Notifications"
                  @click.stop="toggleCloseAccountDropdown('notifications')"
                >
                  <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.159V11a6 6 0 1 0-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9" />
                  </svg>
                </button>
                <span
                  v-if="shouldShowIconTooltip('notifications')"
                  class="pointer-events-none absolute left-1/2 top-full z-[70] mt-3 -translate-x-1/2 whitespace-nowrap rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm"
                >
                  Notifications
                  <span class="absolute -top-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-l border-t border-slate-200 bg-white"></span>
                </span>
                <div
                  v-if="closeAccountDropdownOpen === 'notifications'"
                  class="absolute right-0 top-full z-50 mt-3 w-72 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg"
                >
                  <a href="#" class="block cursor-pointer rounded-lg px-2 py-2 text-sm text-slate-900 hover:bg-slate-50" @click.prevent>
                    See all notifications
                  </a>
                </div>
              </div>
              <div
                class="relative group"
                @mouseenter="handleIconMouseEnter('account')"
                @mouseleave="handleIconMouseLeave('account')"
                @mousedown="handleIconMouseDown"
              >
                <button
                  type="button"
                  class="rounded-full border border-slate-700 p-1 text-slate-700 transition-colors hover:bg-slate-100 cursor-pointer"
                  aria-label="Account"
                  @click.stop="toggleCloseAccountDropdown('account')"
                >
                  <svg class="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 7.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM4.5 20.25a7.5 7.5 0 0 1 15 0" />
                  </svg>
                </button>
                <span
                  v-if="shouldShowIconTooltip('account')"
                  class="pointer-events-none absolute left-1/2 top-full z-[70] mt-3 -translate-x-1/2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm"
                >
                  Account
                  <span class="absolute -top-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-l border-t border-slate-200 bg-white"></span>
                </span>
                <div
                  v-if="closeAccountDropdownOpen === 'account'"
                  class="absolute right-0 top-full z-50 mt-2 w-60 max-w-[calc(100vw-1.5rem)] overflow-visible rounded-xl border border-slate-300 bg-white text-sm shadow-lg sm:w-64"
                >
                  <div class="relative z-10 p-3">
                    <div class="flex items-center gap-2">
                      <div class="rounded-full border border-slate-700 p-0.5 text-slate-700">
                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 7.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM4.5 20.25a7.5 7.5 0 0 1 15 0" />
                        </svg>
                      </div>
                      <div class="min-w-0">
                        <p class="truncate text-[15px] font-medium leading-tight text-slate-900">{{ auth.fullName || 'User' }}</p>
                        <p class="mt-0.5 text-xs text-slate-500 capitalize">{{ auth.role === 'client' ? 'Basic' : auth.role }}</p>
                      </div>
                    </div>

                    <div class="mt-3 flex items-center justify-between gap-2">
                      <span class="text-xs text-slate-800">Online for messages</span>
                      <button type="button" class="h-5 w-9 shrink-0 rounded-full bg-green-600 p-0.5 cursor-pointer" aria-label="Online status toggle">
                        <span class="block h-3.5 w-3.5 translate-x-4 rounded-full bg-white"></span>
                      </button>
                    </div>

                    <a href="#" class="mt-3 block cursor-pointer rounded-lg border border-lime-300 p-2.5 hover:bg-lime-50" @click.prevent>
                      <p class="text-sm font-medium text-slate-900">Try Business Plus →</p>
                      <p class="mt-0.5 text-xs leading-snug text-slate-600">Upgrade for quicker access to the top 1% of freelancers.</p>
                    </a>

                    <ul class="mt-3 space-y-1">
                      <li>
                        <a href="#" class="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-900 hover:bg-slate-50" @click.prevent>
                          <svg class="h-4 w-4 shrink-0 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                            <path stroke-linecap="round" d="M5 14.5a7 7 0 0 1 14 0" />
                            <path stroke-linecap="round" d="M12 14.5L8.25 9.25" />
                          </svg>
                          <span>Account health</span>
                        </a>
                      </li>
                      <li>
                        <a href="#" class="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-900 hover:bg-slate-50" @click.prevent>
                          <svg class="h-4 w-4 shrink-0 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                            <rect x="4" y="6" width="16" height="12" rx="2" />
                            <circle cx="9" cy="10.5" r="1.35" />
                            <path stroke-linecap="round" d="M7.1 14.25h3.8" />
                            <path stroke-linecap="round" d="M13.5 9h5M13.5 12h5M13.5 15h3.75" />
                          </svg>
                          <span>Membership plan</span>
                        </a>
                      </li>
                      <li>
                        <a href="#" class="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-900 hover:bg-slate-50" @click.prevent>
                          <svg class="h-4 w-4 shrink-0 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 7.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5a7.35 7.35 0 0 1 8.4-4.05" />
                            <circle cx="18.25" cy="16.75" r="2.75" />
                            <path stroke-linecap="round" d="M18.25 15.35v2.8M17.1 16.75h2.3" />
                          </svg>
                          <span>Invite a coworker</span>
                        </a>
                      </li>
                      <li class="relative z-20">
                        <button
                          type="button"
                          class="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm text-slate-900 transition-colors hover:bg-slate-50"
                          :aria-expanded="closeAccountThemeSubmenuOpen"
                          aria-haspopup="true"
                          aria-controls="close-account-theme-menu"
                          @click.stop="toggleCloseAccountThemeSubmenu"
                        >
                          <svg class="h-4 w-4 shrink-0 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                            <circle cx="12" cy="12" r="3.25" />
                            <path stroke-linecap="round" d="M12 2.25v2M12 19.75v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2.25 12h2M19.75 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                          </svg>
                          <span class="min-w-0 flex-1">Theme: {{ closeAccountThemeLabel }}</span>
                          <svg
                            class="h-3.5 w-3.5 shrink-0 text-slate-500 transition-transform duration-200"
                            :class="{ 'rotate-180': closeAccountThemeSubmenuOpen }"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7" />
                          </svg>
                        </button>

                        <div
                          v-if="closeAccountThemeSubmenuOpen"
                          id="close-account-theme-menu"
                          class="absolute right-full top-0 z-[80] mr-5 flex w-60 max-w-[calc(100vw-1.5rem)] flex-col gap-1.5 rounded-xl border border-slate-200 bg-white p-2.5 text-sm shadow-lg sm:w-64"
                          role="menu"
                          @click.stop
                        >
                          <button
                            type="button"
                            role="menuitem"
                            class="flex w-full cursor-pointer items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-slate-50"
                            :class="ui.themePreference === 'auto' ? 'bg-sky-100' : ''"
                            @click="selectCloseAccountTheme('auto')"
                          >
                            <span class="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center text-slate-700" aria-hidden="true">
                              <svg
                                v-if="ui.themePreference === 'auto'"
                                class="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                stroke-width="2"
                              >
                                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                              </svg>
                              <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                                <rect x="3" y="4.5" width="18" height="12" rx="1.5" />
                                <path stroke-linecap="round" d="M3 15h18" />
                                <path stroke-linecap="round" d="M9 19.5h6" />
                              </svg>
                            </span>
                            <span class="min-w-0">
                              <span class="block text-xs font-semibold text-slate-900">Auto</span>
                              <span class="mt-0.5 block text-[11px] leading-snug text-slate-500">Use the same theme as your device</span>
                            </span>
                          </button>
                          <button
                            type="button"
                            role="menuitem"
                            class="flex w-full cursor-pointer items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-slate-50"
                            :class="ui.themePreference === 'light' ? 'bg-sky-100' : ''"
                            @click="selectCloseAccountTheme('light')"
                          >
                            <span class="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center text-slate-700" aria-hidden="true">
                              <svg
                                v-if="ui.themePreference === 'light'"
                                class="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                stroke-width="2"
                              >
                                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                              </svg>
                              <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                                <circle cx="12" cy="12" r="3.25" />
                                <path stroke-linecap="round" d="M12 2.25v2M12 19.75v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2.25 12h2M19.75 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                              </svg>
                            </span>
                            <span class="min-w-0">
                              <span class="block text-xs font-semibold text-slate-900">Light</span>
                              <span class="mt-0.5 block text-[11px] leading-snug text-slate-500">Light background with dark text</span>
                            </span>
                          </button>
                          <button
                            type="button"
                            role="menuitem"
                            class="flex w-full cursor-pointer items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-slate-50"
                            :class="ui.themePreference === 'dark' ? 'bg-sky-100' : ''"
                            @click="selectCloseAccountTheme('dark')"
                          >
                            <span class="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center text-slate-700" aria-hidden="true">
                              <svg
                                v-if="ui.themePreference === 'dark'"
                                class="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                stroke-width="2"
                              >
                                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                              </svg>
                              <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                                />
                              </svg>
                            </span>
                            <span class="min-w-0">
                              <span class="block text-xs font-semibold text-slate-900">Dark</span>
                              <span class="mt-0.5 block text-[11px] leading-snug text-slate-500">Dark background with light text</span>
                            </span>
                          </button>
                        </div>
                      </li>
                      <li>
                        <RouterLink
                          to="/settings/close-account"
                          class="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-900 hover:bg-slate-50"
                        >
                          <svg class="h-4 w-4 shrink-0 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.592c.55 0 1.02.398 1.11.94l.213 1.28a1.125 1.125 0 0 0 1.484.866l1.22-.49a1.125 1.125 0 0 1 1.312.437l1.296 2.244c.275.476.19 1.082-.202 1.46l-.995.96a1.125 1.125 0 0 0 0 1.618l.995.96c.392.378.477.984.202 1.46l-1.296 2.244a1.125 1.125 0 0 1-1.312.437l-1.22-.49a1.125 1.125 0 0 0-1.484.866l-.213 1.28c-.09.542-.56.94-1.11.94h-2.592a1.125 1.125 0 0 1-1.11-.94l-.213-1.28a1.125 1.125 0 0 0-1.484-.866l-1.22.49a1.125 1.125 0 0 1-1.312-.437L2.7 16.66a1.125 1.125 0 0 1 .202-1.46l.995-.96a1.125 1.125 0 0 0 0-1.618l-.995-.96a1.125 1.125 0 0 1-.202-1.46L4 7.958c.275-.476.878-.677 1.312-.437l1.22.49a1.125 1.125 0 0 0 1.484-.866l.213-1.28z"
                            />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                          </svg>
                          <span>Account settings</span>
                        </RouterLink>
                      </li>
                    </ul>
                  </div>
                  <div class="relative z-0 border-t border-slate-200 p-2">
                    <button
                      type="button"
                      class="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm text-slate-900 hover:bg-slate-50"
                      @click="auth.logout()"
                    >
                      <svg class="h-4 w-4 shrink-0 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M16.5 3h-6A2.25 2.25 0 0 0 8.25 5.25v13.5A2.25 2.25 0 0 0 10.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M15 12H4.5m0 0 3-3m-3 3 3-3"
                        />
                      </svg>
                      <span>Log out</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-else-if="isFreelanceJobsLanding"
              class="hidden lg:flex items-center gap-2.5 shrink-0"
            >
              <RouterLink
                v-if="auth.isClient"
                :to="{ name: 'client-job-post-instant-welcome' }"
                class="inline-flex items-center justify-center rounded-xl px-5 py-2.5 bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors whitespace-nowrap"
              >
                Post a Job
              </RouterLink>
              <RouterLink
                v-else
                :to="dashboardRoute"
                class="inline-flex items-center justify-center rounded-xl px-5 py-2.5 bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors whitespace-nowrap"
              >
                Dashboard
              </RouterLink>
            </div>
            <RouterLink
              v-else
              :to="dashboardRoute"
              class="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 transition-colors"
            >
              Dashboard
            </RouterLink>
            <span
              v-if="showHeaderSearch"
              class="inline-flex min-h-10 min-w-10 shrink-0 cursor-default items-center justify-center rounded-lg text-slate-800 min-[1080px]:hidden"
              aria-hidden="true"
            >
              <svg class="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
          </template>
        </div>
      </div>
    </div>
  </header>

  <!-- Full-screen mobile navigation (Upwork-style) -->
  <Teleport to="body">
    <Transition name="mobile-fs">
      <div
        v-if="mobileMenuOpen"
        id="mobile-menu"
        class="fixed inset-0 z-[200] flex min-h-0 min-[992px]:hidden flex-col bg-white"
        role="dialog"
        aria-modal="true"
        :aria-label="`Main menu — ${APP_CONFIG.name}`"
      >
        <!-- Sticky headers: white bar always; gray drill bar when in a category -->
        <div class="shrink-0 bg-white shadow-[0_4px_14px_-6px_rgba(15,23,42,0.12)]">
          <div class="flex h-14 items-center gap-2 px-2 sm:px-4">
            <button
              type="button"
              class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-slate-950 hover:bg-slate-50"
              aria-label="Close menu"
              @click="closeMobileMenu"
            >
              <svg class="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-width="1.5"
                  d="M6 6l12 12M18 6L6 18"
                />
              </svg>
            </button>
            <RouterLink
              to="/"
              class="min-w-0 flex-1 truncate text-left font-bold uppercase tracking-tight text-slate-950 sm:text-lg"
              @click="closeMobileMenu"
            >
              {{ APP_CONFIG.name }}
            </RouterLink>
            <span
              class="inline-flex h-11 w-11 shrink-0 cursor-default items-center justify-center rounded-lg text-slate-950"
              aria-hidden="true"
            >
              <svg class="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
          </div>
          <div
            v-if="mobileMenuDrill && !isClientWorkspaceHeader"
            class="flex h-12 items-center gap-1 bg-[#f2f2f2] px-2 shadow-[0_4px_12px_-6px_rgba(15,23,42,0.1)] sm:gap-2 sm:px-4"
          >
            <button
              type="button"
              class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-950 hover:bg-black/5"
              aria-label="Back"
              @click="closeMobileMenuDrill"
            >
              <svg class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="m15 18-6-6 6-6"
                />
              </svg>
            </button>
            <h2 class="min-w-0 flex-1 truncate text-[15px] font-medium text-slate-950 sm:text-base">
              {{ mobileMenuDrill.title }}
            </h2>
            <button
              type="button"
              class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-950 hover:bg-black/5"
              aria-label="Close menu"
              @click="closeMobileMenu"
            >
              <svg class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-width="1.5"
                  d="M6 6l12 12M18 6L6 18"
                />
              </svg>
            </button>
          </div>
        </div>

        <div
          class="min-h-0 flex-1 overflow-y-auto overscroll-contain"
          :class="
            mobileMenuDrill && !isClientWorkspaceHeader
              ? 'bg-white px-5 sm:px-6'
              : 'px-4 sm:px-6'
          "
        >
          <template v-if="isClientWorkspaceHeader">
            <nav aria-label="Client workspace">
              <RouterLink
                v-for="item in clientMobileWorkspaceLinks"
                :key="item.label"
                :to="item.to"
                class="flex w-full items-center py-4 text-left text-base text-slate-950"
                @click="closeMobileMenu"
              >
                {{ item.label }}
              </RouterLink>
            </nav>
          </template>

          <template v-else-if="mobileMenuDrill">
            <nav class="pb-8 pt-4" :aria-label="mobileMenuDrill.title">
              <RouterLink
                v-for="item in mobileMenuDrill.items"
                :key="item.label"
                :to="item.to"
                class="block py-4 text-base leading-normal text-slate-950 hover:text-slate-900"
                @click="closeMobileMenu"
              >
                {{ item.label }}
              </RouterLink>
            </nav>
          </template>

          <template v-else>
            <nav aria-label="Main navigation">
              <!-- Hire freelancers -->
              <div class="py-1">
                <button
                  type="button"
                  :class="[
                    'flex w-full items-center justify-between gap-3 py-4 text-left text-lg text-slate-950 transition-colors',
                    mobileAccordion === 'hire' ? '-mx-4 bg-slate-100 px-4 sm:-mx-6 sm:px-6' : '',
                  ]"
                  :aria-expanded="mobileAccordion === 'hire'"
                  @click="toggleMobileAccordion('hire')"
                >
                  <span>Hire freelancers</span>
                  <svg
                    class="h-6 w-6 shrink-0 transition-transform duration-200"
                    :class="
                      mobileAccordion === 'hire'
                        ? 'rotate-180 text-green-600'
                        : 'text-slate-950'
                    "
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="m6 9 6 6 6-6"
                    />
                  </svg>
                </button>
                <div v-if="mobileAccordion === 'hire'" class="pb-3 pl-4 pt-1 sm:pl-6">
                  <button
                    v-for="section in hireMobileSectionsOrdered"
                    :key="section.title"
                    type="button"
                    class="flex w-full items-center justify-between gap-3 py-3.5 pr-0.5 text-left text-[15px] text-slate-950 active:bg-slate-50"
                    @click="openHireMobileDrill(section)"
                  >
                    <span>{{ section.title }}</span>
                    <svg
                      class="h-5 w-5 shrink-0 text-slate-950"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="m9 18 6-6-6-6"
                      />
                    </svg>
                  </button>
                  <div class="mt-2 flex flex-col gap-3 pt-2">
                    <a
                      v-for="cta in HIRE_FREELANCER_MENU.ctas"
                      :key="cta"
                      href="#"
                      class="inline-flex items-center gap-1 text-[15px] font-semibold text-green-600 underline decoration-green-600/50 underline-offset-4 hover:text-green-700"
                      @click.prevent
                    >
                      {{ cta }}
                      <span aria-hidden="true">→</span>
                    </a>
                  </div>
                </div>
              </div>

              <!-- Find work -->
              <div class="py-1">
                <button
                  type="button"
                  :class="[
                    'flex w-full items-center justify-between gap-3 py-4 text-left text-lg text-slate-950 transition-colors',
                    mobileAccordion === 'find' ? '-mx-4 bg-slate-100 px-4 sm:-mx-6 sm:px-6' : '',
                  ]"
                  :aria-expanded="mobileAccordion === 'find'"
                  @click="toggleMobileAccordion('find')"
                >
                  <span>Find work</span>
                  <svg
                    class="h-6 w-6 shrink-0 transition-transform duration-200"
                    :class="
                      mobileAccordion === 'find'
                        ? 'rotate-180 text-green-600'
                        : 'text-slate-950'
                    "
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="m6 9 6 6 6-6"
                    />
                  </svg>
                </button>
                <div v-if="mobileAccordion === 'find'" class="pb-3 pl-4 pt-1 sm:pl-6">
                  <button
                    v-for="section in findWorkMobileSectionsOrdered"
                    :key="section.title"
                    type="button"
                    class="flex w-full items-center justify-between gap-3 py-3.5 pr-0.5 text-left text-[15px] text-slate-950 active:bg-slate-50"
                    @click="openFindMobileDrill(section)"
                  >
                    <span>{{ section.title.replace(/\s+jobs$/i, '') }}</span>
                    <svg
                      class="h-5 w-5 shrink-0 text-slate-950"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="m9 18 6-6-6-6"
                      />
                    </svg>
                  </button>
                  <div class="mt-2 flex flex-col gap-3 pt-2">
                    <a
                      v-for="cta in FIND_WORK_MENU.ctas"
                      :key="cta"
                      href="#"
                      class="inline-flex items-center gap-1 text-[15px] font-semibold text-green-600 underline decoration-green-600/50 underline-offset-4 hover:text-green-700"
                      @click.prevent
                    >
                      {{ cta }}
                      <span aria-hidden="true">→</span>
                    </a>
                  </div>
                </div>
              </div>

              <RouterLink
                :to="{ name: 'pricing' }"
                class="flex w-full items-center py-4 text-lg text-slate-950"
                @click="closeMobileMenu"
              >
                Pricing
              </RouterLink>
            </nav>
          </template>
        </div>

        <div
          v-if="isClientWorkspaceHeader || !mobileMenuDrill"
          class="relative z-10 shrink-0 space-y-3 bg-white px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 shadow-[0_-8px_28px_-6px_rgba(15,23,42,0.16)] sm:px-6"
        >
          <template v-if="isClientWorkspaceHeader && auth.isClient">
            <RouterLink
              :to="{ name: 'client-job-post-instant-welcome' }"
              class="block w-full rounded-full bg-green-600 py-3.5 text-center text-sm font-semibold text-white hover:bg-green-700"
              @click="closeMobileMenu"
            >
              Post a Job
            </RouterLink>
          </template>
          <template v-else-if="!auth.isAuthenticated">
            <RouterLink
              to="/auth/signup"
              class="block w-full rounded-full bg-green-600 py-3.5 text-center text-sm font-semibold text-white hover:bg-green-700"
              @click="closeMobileMenu"
            >
              Sign up
            </RouterLink>
            <RouterLink
              to="/auth/login"
              class="block w-full rounded-full border border-green-600 bg-white py-3.5 text-center text-sm font-semibold text-green-600 hover:bg-green-50"
              @click="closeMobileMenu"
            >
              Log in
            </RouterLink>
          </template>
          <template v-else>
            <RouterLink
              :to="dashboardRoute"
              class="block w-full rounded-full bg-green-600 py-3.5 text-center text-sm font-semibold text-white hover:bg-green-700"
              @click="closeMobileMenu"
            >
              Dashboard
            </RouterLink>
          </template>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useUIStore, type ThemePreference } from '@/stores/ui.store'
import { APP_CONFIG } from '@/config/app.config'
import AppLogo from '@/components/common/AppLogo.vue'
import { hireTalentPath } from '@/constants/hire-talent.landing'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const ui = useUIStore()
const mobileMenuOpen = ref(false)
const mobileAccordion = ref<null | 'hire' | 'find'>(null)

/** Second-level mobile panel: category title + role/job links */
interface MobileMenuDrillPayload {
  title: string
  items: readonly { label: string; to: string }[]
}

const mobileMenuDrill = ref<MobileMenuDrillPayload | null>(null)

function closeMobileMenu(): void {
  mobileMenuOpen.value = false
  mobileMenuDrill.value = null
}

function closeMobileMenuDrill(): void {
  mobileMenuDrill.value = null
}

function openHireMobileDrill(section: {
  title: string
  items: readonly { label: string; to: string }[]
}): void {
  mobileMenuDrill.value = { title: section.title, items: section.items }
}

function openFindMobileDrill(section: {
  title: string
  items: readonly { label: string; to: string }[]
}): void {
  mobileMenuDrill.value = {
    title: section.title.replace(/\s+jobs$/i, ''),
    items: section.items,
  }
}

function toggleMobileAccordion(id: 'hire' | 'find'): void {
  mobileMenuDrill.value = null
  mobileAccordion.value = mobileAccordion.value === id ? null : id
}

/** Desktop client workspace: Hire talent / Manage work / Reports hover menus */
const clientWorkspaceNavMenu = ref<'hire' | 'manage' | 'reports' | null>(null)
const hireMenuOpen = ref(false)
const findWorkMenuOpen = ref(false)
const stickySearchQuery = ref('')
const stickySearchType = ref<'talent' | 'projects' | 'jobs'>('talent')
const closeAccountDropdownOpen = ref<'help' | 'notifications' | 'account' | null>(null)
const closeAccountThemeSubmenuOpen = ref(false)
const suppressedTooltip = ref<'help' | 'notifications' | 'account' | null>(null)
const hoveredIconTooltip = ref<'help' | 'notifications' | 'account' | null>(null)
const iconPressing = ref(false)
const stickyTypeMenuOpen = ref(false)
const stickySearchFieldFocused = ref(false)
const showStickySearch = ref(false)
const stickyTypeDropdownRef = ref<HTMLElement | null>(null)
const publicHeaderRef = ref<HTMLElement | null>(null)
const stickyDropdownFixedStyle = ref<Record<string, string>>({})
const closeAccountActionsRef = ref<HTMLElement | null>(null)

let stopStickyDropdownPositionListeners: (() => void) | null = null

let rafId: number | null = null
const handleWindowMouseUp = () => { iconPressing.value = false }

function updateStickySearchVisibility(): void {
  if (route.path !== '/') {
    showStickySearch.value = false
    return
  }

  const heroSearch = document.querySelector<HTMLElement>('[data-hero-search-anchor]')
  if (!heroSearch) {
    showStickySearch.value = false
    return
  }

  const headerHeight = 64 // h-16
  const triggerOffset = 10
  const heroSearchRect = heroSearch.getBoundingClientRect()
  showStickySearch.value = heroSearchRect.bottom <= headerHeight + triggerOffset
}

/** Viewport strictly below 992px (pairs with min-[992px] desktop nav): Sign up link / compact header. */
const signupNarrowViewport = ref(false)
const headerScrolledPastTop = ref(false)
let signupNarrowMq: MediaQueryList | null = null

const SCROLL_SIGNUP_COMPACT_PX = 16

function syncSignupNarrowMq(): void {
  signupNarrowViewport.value = window.matchMedia('(max-width: 991.98px)').matches
}

function updateHeaderScrolledPastTop(): void {
  const y = window.scrollY || document.documentElement.scrollTop
  headerScrolledPastTop.value = y > SCROLL_SIGNUP_COMPACT_PX
}

const signupAuthNarrowClass = computed(() => {
  if (!signupNarrowViewport.value) return ''
  if (headerScrolledPastTop.value) {
    return 'inline-flex items-center rounded-lg bg-green-600 px-3 py-2 font-medium text-white hover:bg-green-700 hover:text-white'
  }
  return 'text-slate-600 hover:text-slate-900'
})

function scheduleStickySearchVisibilityUpdate(): void {
  if (rafId != null) return
  rafId = window.requestAnimationFrame(() => {
    updateStickySearchVisibility()
    updateHeaderScrolledPastTop()
    rafId = null
  })
}

function handleStickySearch(): void {
  const q = stickySearchQuery.value.trim()
  const path = stickySearchType.value === 'talent' ? '/search/talent' : '/search/jobs'
  if (!q) {
    router.push(path)
    return
  }

  if (stickySearchType.value === 'talent') {
    router.push({ path, query: { q } })
    return
  }

  if (stickySearchType.value === 'projects') {
    router.push({ path, query: { search: q, type: 'projects' } })
    return
  }

  router.push({ path, query: { search: q } })
}

function selectStickySearchType(type: 'talent' | 'projects' | 'jobs'): void {
  stickySearchType.value = type
  stickyTypeMenuOpen.value = false
}

function handleStickyTypeOutsideClick(event: MouseEvent): void {
  const target = event.target as Node | null
  if (!target) return
  if (stickyTypeDropdownRef.value?.contains(target)) return
  stickyTypeMenuOpen.value = false
  if (closeAccountActionsRef.value?.contains(target)) return
  closeAccountDropdownOpen.value = null
}

function toggleCloseAccountDropdown(menu: 'help' | 'notifications' | 'account'): void {
  if (closeAccountDropdownOpen.value === menu) {
    closeAccountDropdownOpen.value = null
    suppressedTooltip.value = menu
    return
  }
  closeAccountDropdownOpen.value = menu
  suppressedTooltip.value = null
  hoveredIconTooltip.value = null
}

const closeAccountThemeLabel = computed(() => {
  const p = ui.themePreference
  if (p === 'auto') return 'Auto'
  if (p === 'dark') return 'Dark'
  return 'Light'
})

function toggleCloseAccountThemeSubmenu(): void {
  closeAccountThemeSubmenuOpen.value = !closeAccountThemeSubmenuOpen.value
}

function selectCloseAccountTheme(pref: ThemePreference): void {
  ui.setThemePreference(pref)
  closeAccountThemeSubmenuOpen.value = false
}

watch(closeAccountDropdownOpen, (v) => {
  if (v !== 'account') closeAccountThemeSubmenuOpen.value = false
})

function unlockTooltipOnReenter(menu: 'help' | 'notifications' | 'account'): void {
  if (suppressedTooltip.value === menu) {
    suppressedTooltip.value = null
  }
}

function handleIconMouseDown(): void {
  iconPressing.value = true
  hoveredIconTooltip.value = null
}

function handleIconMouseEnter(menu: 'help' | 'notifications' | 'account'): void {
  unlockTooltipOnReenter(menu)
  hoveredIconTooltip.value = menu
}

function handleIconMouseLeave(menu: 'help' | 'notifications' | 'account'): void {
  if (hoveredIconTooltip.value === menu) {
    hoveredIconTooltip.value = null
  }
}

function shouldShowIconTooltip(menu: 'help' | 'notifications' | 'account'): boolean {
  if (closeAccountDropdownOpen.value === menu) return false
  if (iconPressing.value) return false
  if (suppressedTooltip.value === menu) return false
  return hoveredIconTooltip.value === menu
}

function onMobileMenuEscape(e: KeyboardEvent): void {
  if (e.key !== 'Escape') return
  if (mobileMenuDrill.value) {
    closeMobileMenuDrill()
    return
  }
  closeMobileMenu()
}

let mobileMenuDesktopMq: MediaQueryList | null = null
function onMobileMenuDesktopMqChange(): void {
  if (mobileMenuDesktopMq?.matches) closeMobileMenu()
}

watch(mobileMenuOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
  if (!open) {
    mobileAccordion.value = null
    mobileMenuDrill.value = null
    window.removeEventListener('keydown', onMobileMenuEscape)
    return
  }
  window.addEventListener('keydown', onMobileMenuEscape)
})

watch(() => route.path, () => {
  mobileMenuOpen.value = false
  hireMenuOpen.value = false
  findWorkMenuOpen.value = false
  stickySearchFieldFocused.value = false
  closeAccountDropdownOpen.value = null
  suppressedTooltip.value = null
  clientWorkspaceNavMenu.value = null
  nextTick(() => {
    updateStickySearchVisibility()
    updateHeaderScrolledPastTop()
  })
})

onMounted(() => {
  updateStickySearchVisibility()
  updateHeaderScrolledPastTop()
  signupNarrowMq = window.matchMedia('(max-width: 991.98px)')
  syncSignupNarrowMq()
  signupNarrowMq.addEventListener('change', syncSignupNarrowMq)
  headerSearchMidBandMq = window.matchMedia('(min-width: 992px) and (max-width: 1079px)')
  syncHeaderSearchMidBandMq()
  headerSearchMidBandMq.addEventListener('change', syncHeaderSearchMidBandMq)
  mobileMenuDesktopMq = window.matchMedia('(min-width: 992px)')
  mobileMenuDesktopMq.addEventListener('change', onMobileMenuDesktopMqChange)
  window.addEventListener('scroll', scheduleStickySearchVisibilityUpdate, { passive: true })
  window.addEventListener('resize', scheduleStickySearchVisibilityUpdate)
  window.addEventListener('click', handleStickyTypeOutsideClick)
  window.addEventListener('mouseup', handleWindowMouseUp)
})

onBeforeUnmount(() => {
  teardownStickyDropdownPositionListeners()
  signupNarrowMq?.removeEventListener('change', syncSignupNarrowMq)
  headerSearchMidBandMq?.removeEventListener('change', syncHeaderSearchMidBandMq)
  mobileMenuDesktopMq?.removeEventListener('change', onMobileMenuDesktopMqChange)
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onMobileMenuEscape)
  window.removeEventListener('scroll', scheduleStickySearchVisibilityUpdate)
  window.removeEventListener('resize', scheduleStickySearchVisibilityUpdate)
  window.removeEventListener('click', handleStickyTypeOutsideClick)
  window.removeEventListener('mouseup', handleWindowMouseUp)
  if (rafId != null) {
    window.cancelAnimationFrame(rafId)
    rafId = null
  }
})

const STICKY_SEARCH_OPTIONS = [
  { value: 'talent', label: 'Talent', description: 'Hire professionals and agencies' },
  { value: 'projects', label: 'Projects', description: 'Buy ready-to-start services' },
  { value: 'jobs', label: 'Jobs', description: 'Apply to jobs posted by clients' },
] as const

const LANDING_TOOLBAR_SEARCH_OPTIONS = STICKY_SEARCH_OPTIONS

const selectedStickyType = computed(() => {
  return STICKY_SEARCH_OPTIONS.find((option) => option.value === stickySearchType.value) ?? STICKY_SEARCH_OPTIONS[0]
})

const selectedLandingToolbarType = computed(() => {
  return LANDING_TOOLBAR_SEARCH_OPTIONS.find((option) => option.value === landingToolbarType.value)
    ?? LANDING_TOOLBAR_SEARCH_OPTIONS[0]
})

const isHomePage = computed(() => route.path === '/')
const isClientWorkspaceHeader = computed(
  () =>
    route.name === 'close-account' ||
    route.name === 'client-job-post-instant-welcome' ||
    route.name === 'client-new-job-guided' ||
    route.name === 'client-job-post-instant-review',
)
const headerHasBottomBorder = computed(
  () =>
    signupNarrowViewport.value ||
    (!isHomePage.value && !isClientWorkspaceHeader.value),
)

function teardownStickyDropdownPositionListeners(): void {
  stopStickyDropdownPositionListeners?.()
  stopStickyDropdownPositionListeners = null
}

function updateStickyDropdownFixedPosition(): void {
  if (!stickyTypeMenuOpen.value || !headerHasBottomBorder.value) return
  const headerEl = publicHeaderRef.value
  const triggerEl = stickyTypeDropdownRef.value
  if (!headerEl || !triggerEl) return
  const headerBottom = headerEl.getBoundingClientRect().bottom
  const left = triggerEl.getBoundingClientRect().left
  stickyDropdownFixedStyle.value = {
    top: `${headerBottom}px`,
    left: `${left}px`,
  }
}

function setupStickyDropdownPositionListeners(): void {
  teardownStickyDropdownPositionListeners()
  const handler = () => {
    updateStickyDropdownFixedPosition()
  }
  void nextTick(() => {
    if (!stickyTypeMenuOpen.value || !headerHasBottomBorder.value) return
    handler()
    window.addEventListener('scroll', handler, { passive: true, capture: true })
    window.addEventListener('resize', handler)
    stopStickyDropdownPositionListeners = () => {
      window.removeEventListener('scroll', handler, { capture: true })
      window.removeEventListener('resize', handler)
    }
  })
}

watch(
  () => [stickyTypeMenuOpen.value, headerHasBottomBorder.value] as const,
  ([open, bordered]) => {
    if (open && bordered) {
      setupStickyDropdownPositionListeners()
    } else {
      teardownStickyDropdownPositionListeners()
      stickyDropdownFixedStyle.value = {}
    }
  },
)

const isFreelanceJobsLanding = computed(
  () =>
    route.name === 'freelance-jobs-index' ||
    route.name === 'freelance-jobs-landing' ||
    route.name === 'hire-hub' ||
    route.name === 'hire-talent-landing' ||
    route.name === 'hire-talent-category',
)
const showHeaderSearch = computed(
  () =>
    isClientWorkspaceHeader.value ||
    showStickySearch.value ||
    isFreelanceJobsLanding.value,
)

/** 992–1079px: compact search before Log in / Sign up when header search is shown. */
const headerSearchMidBand = ref(false)
let headerSearchMidBandMq: MediaQueryList | null = null

function syncHeaderSearchMidBandMq(): void {
  headerSearchMidBand.value = window.matchMedia('(min-width: 992px) and (max-width: 1079px)').matches
}

const guestCompactSearchReorderClass = computed(() => {
  if (!showHeaderSearch.value) return ''
  if (signupNarrowViewport.value || headerSearchMidBand.value) return 'order-1'
  return ''
})
const guestLoginReorderClass = computed(() => {
  if (!showHeaderSearch.value || !headerSearchMidBand.value) return ''
  return 'order-2'
})
const guestSignupReorderClass = computed(() => {
  if (!showHeaderSearch.value) return ''
  if (signupNarrowViewport.value) return 'order-2'
  if (headerSearchMidBand.value) return 'order-3'
  return ''
})

const isPricingActive = computed(() => route.name === 'pricing')

const dashboardRoute = computed(() => {
  const map: Record<string, string> = {
    freelancer: '/freelancer/dashboard',
    client: '/client/dashboard',
    admin: '/admin/dashboard',
  }
  return map[auth.role] ?? '/'
})
const messagesRoute = computed(() => {
  const map: Record<string, string> = {
    freelancer: '/freelancer/messages',
    client: '/client/messages',
    admin: '/admin/messages',
  }
  return map[auth.role] ?? '/messages'
})

const NAV_LINKS = computed(() => {
  if (isClientWorkspaceHeader.value) {
    return [
      { label: 'Hire talent', to: '#' },
      { label: 'Manage work', to: '#' },
      { label: 'Reports', to: '#' },
      { label: 'Messages', to: messagesRoute.value },
    ] as const
  }
  return [
    { label: 'Hire freelancers', to: '/search/talent' },
    { label: 'Find work', to: '/browse-jobs' },
    { label: 'Pricing', to: { name: 'pricing' } },
  ] as const
})

const HIRE_FREELANCER_MENU = {
  topSections: [
    {
      title: 'Admin & support',
      items: [
        { label: 'Cold callers', to: hireTalentPath('cold-callers') },
        { label: 'Content moderators', to: hireTalentPath('content-moderators') },
        { label: 'Lead generation specialists', to: hireTalentPath('lead-generation-specialists') },
        { label: 'Personal assistants', to: hireTalentPath('personal-assistants') },
        { label: 'Virtual assistants', to: hireTalentPath('virtual-assistants') },
      ],
    },
    {
      title: 'Design & creative',
      items: [
        { label: 'Graphic designers', to: hireTalentPath('graphic-designers') },
        { label: 'Illustrators', to: hireTalentPath('illustrators') },
        { label: 'Logo designers', to: hireTalentPath('logo-designers') },
        { label: 'UX designers', to: hireTalentPath('ux-designers') },
        { label: 'Web designers', to: hireTalentPath('web-designers') },
      ],
    },
    {
      title: 'Marketing',
      items: [
        { label: 'Digital marketers', to: hireTalentPath('digital-marketers') },
        { label: 'Email marketers', to: hireTalentPath('email-marketers') },
        { label: 'Google Ads experts', to: hireTalentPath('google-ads-experts') },
        { label: 'SEO experts', to: hireTalentPath('seo-experts') },
        { label: 'Social media managers', to: hireTalentPath('social-media-managers') },
      ],
    },
    {
      title: 'Writing & content',
      items: [
        { label: 'Book editors', to: hireTalentPath('book-editors') },
        { label: 'Content writers', to: hireTalentPath('content-writers') },
        { label: 'Copywriters', to: hireTalentPath('copywriters') },
        { label: 'Email copywriters', to: hireTalentPath('email-copywriters') },
        { label: 'Ghostwriters', to: hireTalentPath('ghostwriters') },
      ],
    },
  ],
  bottomSections: [
    {
      title: 'AI & emerging tech',
      items: [
        { label: 'Automation engineers', to: hireTalentPath('automation-engineers') },
        { label: 'Chatbot developers', to: hireTalentPath('chatbot-developers') },
        { label: 'Computer vision engineers', to: hireTalentPath('computer-vision-engineers') },
        { label: 'Ethical hackers', to: hireTalentPath('ethical-hackers') },
        { label: 'Machine learning engineers', to: hireTalentPath('machine-learning-engineers') },
      ],
    },
    {
      title: 'Development & tech',
      items: [
        { label: 'Mobile app developers', to: hireTalentPath('mobile-app-developers') },
        { label: 'Python developers', to: hireTalentPath('python-developers') },
        { label: 'Software developers', to: hireTalentPath('software-developers') },
        { label: 'Web developers', to: hireTalentPath('web-developers') },
        { label: 'WordPress developers', to: hireTalentPath('wordpress-developers') },
      ],
    },
    {
      title: 'Video, audio & animation',
      items: [
        { label: 'Animators', to: hireTalentPath('animators') },
        { label: 'Audio editors', to: hireTalentPath('audio-editors') },
        { label: 'Music producers', to: hireTalentPath('music-producers') },
        { label: 'Video editors', to: hireTalentPath('video-editors') },
        { label: 'Voice actors', to: hireTalentPath('voice-actors') },
      ],
    },
  ],
  ctas: ['Explore more', 'Book consultation', 'Join Business Plus'],
} as const

const FIND_WORK_MENU = {
  sections: [
    {
      title: 'Admin & support jobs',
      items: [
        { label: 'Chat support jobs', to: '/freelance-jobs/chat-support-jobs' },
        { label: 'Cold calling jobs', to: '/freelance-jobs/cold-calling-jobs' },
        { label: 'Content moderation jobs', to: '/freelance-jobs/content-moderation-jobs' },
        { label: 'Lead generation jobs', to: '/freelance-jobs/lead-generation-jobs' },
        { label: 'Virtual assistant jobs', to: '/freelance-jobs/virtual-assistant-jobs' },
      ],
    },
    {
      title: 'Design & creative jobs',
      items: [
        { label: 'Canva jobs', to: '/freelance-jobs/canva-jobs' },
        { label: 'Graphic design jobs', to: '/freelance-jobs/graphic-design-jobs' },
        { label: 'Illustration jobs', to: '/freelance-jobs/illustration-jobs' },
        { label: 'Logo design jobs', to: '/freelance-jobs/logo-design-jobs' },
        { label: 'Web design jobs', to: '/freelance-jobs/web-design-jobs' },
      ],
    },
    {
      title: 'Marketing jobs',
      items: [
        { label: 'Digital marketing jobs', to: '/freelance-jobs/digital-marketing-jobs' },
        { label: 'Email marketing jobs', to: '/freelance-jobs/email-marketing-jobs' },
        { label: 'Google Ads jobs', to: '/freelance-jobs/google-ads-jobs' },
        { label: 'SEO jobs', to: '/freelance-jobs/seo-jobs' },
        { label: 'Social media management jobs', to: '/freelance-jobs/social-media-management-jobs' },
      ],
    },
    {
      title: 'Writing & content jobs',
      items: [
        { label: 'Book editing jobs', to: '/freelance-jobs/book-editing-jobs' },
        { label: 'Content writing jobs', to: '/freelance-jobs/content-writing-jobs' },
        { label: 'Copywriting jobs', to: '/freelance-jobs/copywriting-jobs' },
        { label: 'Email copywriting jobs', to: '/freelance-jobs/email-copywriting-jobs' },
        { label: 'Ghostwriting jobs', to: '/freelance-jobs/ghostwriting-jobs' },
      ],
    },
    {
      title: 'AI & emerging tech jobs',
      items: [
        { label: 'AI app development jobs', to: '/freelance-jobs/ai-app-development-jobs' },
        { label: 'Chatbot development jobs', to: '/freelance-jobs/chatbot-development-jobs' },
        { label: 'Ethical hacking jobs', to: '/freelance-jobs/ethical-hacking-jobs' },
        { label: 'Machine learning jobs', to: '/freelance-jobs/machine-learning-jobs' },
        { label: 'OpenAI jobs', to: '/freelance-jobs/openai-jobs' },
      ],
    },
    {
      title: 'Development & tech jobs',
      items: [
        { label: 'Mobile app development jobs', to: '/freelance-jobs/mobile-app-development-jobs' },
        { label: 'Python jobs', to: '/freelance-jobs/python-jobs' },
        { label: 'Software development jobs', to: '/freelance-jobs/software-development-jobs' },
        { label: 'Web development jobs', to: '/freelance-jobs/website-development' },
        { label: 'WordPress jobs', to: '/freelance-jobs/wordpress-jobs' },
      ],
    },
    {
      title: 'Video, audio & animation jobs',
      items: [
        { label: 'Animation jobs', to: '/freelance-jobs/animation-jobs' },
        { label: 'Audio editing jobs', to: '/freelance-jobs/audio-editing-jobs' },
        { label: 'Music production jobs', to: '/freelance-jobs/music-production-jobs' },
        { label: 'Video editing jobs', to: '/freelance-jobs/video-editing-jobs' },
        { label: 'Voice over jobs', to: '/freelance-jobs/voice-over-jobs' },
      ],
    },
  ],
  ctas: ['Explore more', 'Ways to earn', 'Win work with ads', 'Join Freelancer Plus'],
} as const

const hireFreelancerMenuAllSections = computed(() => [
  ...HIRE_FREELANCER_MENU.topSections,
  ...HIRE_FREELANCER_MENU.bottomSections,
])

const HIRE_MOBILE_SECTION_ORDER = [
  'Admin & support',
  'AI & emerging tech',
  'Design & creative',
  'Development & tech',
  'Marketing',
  'Video, audio & animation',
  'Writing & content',
] as const

const FIND_MOBILE_SECTION_ORDER = [
  'Admin & support jobs',
  'AI & emerging tech jobs',
  'Design & creative jobs',
  'Development & tech jobs',
  'Marketing jobs',
  'Video, audio & animation jobs',
  'Writing & content jobs',
] as const

const hireMobileSectionsOrdered = computed(() => {
  const all = hireFreelancerMenuAllSections.value
  const byTitle = new Map(all.map((s) => [s.title, s]))
  const out: (typeof all)[number][] = []
  for (const title of HIRE_MOBILE_SECTION_ORDER) {
    const s = byTitle.get(title)
    if (s) out.push(s)
  }
  for (const s of all) {
    if (!out.some((o) => o.title === s.title)) out.push(s)
  }
  return out
})

const findWorkMobileSectionsOrdered = computed(() => {
  const all = [...FIND_WORK_MENU.sections]
  const byTitle = new Map(all.map((s) => [s.title, s]))
  const out: (typeof all)[number][] = []
  for (const title of FIND_MOBILE_SECTION_ORDER) {
    const s = byTitle.get(title)
    if (s) out.push(s)
  }
  for (const s of all) {
    if (!out.some((o) => o.title === s.title)) out.push(s)
  }
  return out
})

const clientMobileWorkspaceLinks = computed(() => [
  { label: 'Post a job', to: { name: 'client-job-post-instant-welcome' } },
  { label: 'Job posts and proposals', to: { name: 'client-jobs' } },
  { label: 'Search for talent', to: { name: 'talent-search' } },
  { label: 'Your contracts', to: { name: 'client-contracts' } },
  { label: 'Transaction history', to: { name: 'client-payments' } },
  { label: 'Messages', to: messagesRoute.value },
])
</script>

<style scoped>
.mobile-fs-enter-active,
.mobile-fs-leave-active {
  transition: opacity 0.2s ease;
}
.mobile-fs-enter-from,
.mobile-fs-leave-to {
  opacity: 0;
}

.menu-fade-enter-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.menu-fade-leave-active {
  transition: none;
}

.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Invisible hit-area bridge: no dead zone between header trigger and fixed mega menu */
.mega-menu-panel::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 100%;
  height: 0.75rem;
}
</style>
