<template>
  <div
    class="relative flex min-h-dvh flex-col overflow-x-hidden text-neutral-900"
    :class="step === 5 ? 'bg-[#f2f2f2]' : 'bg-white'"
  >
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
    <div class="relative z-10 flex min-h-0 flex-1 flex-col">
    <div class="mx-auto w-full max-w-6xl flex-1 px-6 py-8 sm:px-8 sm:py-10">
    <!-- Email verification -->
    <div
      v-if="showVerifyBanner"
      class="mb-8 flex gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
      role="status"
    >
      <svg class="mt-0.5 h-5 w-5 shrink-0 text-amber-700" fill="currentColor" viewBox="0 0 20 20">
        <path
          fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clip-rule="evenodd"
        />
      </svg>
      <p class="min-w-0 flex-1 leading-snug">
        Just a reminder that to access all the features of Downwork, you’ll need to
        <RouterLink
          :to="{ name: 'verify-email' }"
          class="cursor-pointer font-medium text-green-700 underline decoration-green-600/40 underline-offset-2 hover:text-green-800"
        >
          verify your email address
        </RouterLink>
        .
      </p>
      <button
        type="button"
        class="shrink-0 cursor-pointer rounded p-1 text-amber-800/70 hover:bg-amber-100 hover:text-amber-950"
        aria-label="Dismiss reminder"
        @click="verifyBannerDismissed = true"
      >
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <div
      class="grid flex-1 gap-10 pb-8 lg:pb-4"
      :class="step === 5 ? '' : 'lg:grid-cols-2 lg:gap-14'"
    >
      <!-- Left: step copy (hidden on Job details review — full-width summary like Upwork) -->
      <div v-if="step !== 5" class="lg:pt-2">
        <p class="text-sm font-medium text-slate-500">{{ guidedStepDisplay }}/{{ GUIDED_JOB_POST_STEP_TOTAL }} Job post</p>
        <template v-if="step === 4">
          <h2 class="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Start the conversation.
          </h2>
          <p class="mt-4 text-sm font-medium text-slate-800">Talent are looking for:</p>
          <ul class="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600 sm:text-base">
            <li>Clear expectations about your task or deliverables</li>
            <li>The skills required for your work</li>
            <li>Good communication</li>
            <li>Details about how you or your team like to work</li>
          </ul>
        </template>
        <template v-else>
          <h2 class="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            {{ stepCopy.title }}
          </h2>
          <p class="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
            {{ stepCopy.body }}
          </p>
        </template>
      </div>

      <!-- Right: step form -->
      <div class="min-w-0" :class="step === 5 ? 'mx-auto w-full max-w-[880px]' : ''">
        <!-- Step 1: Title -->
        <div v-if="step === 0" class="space-y-4">
          <label class="block text-sm font-medium text-slate-800" for="guided-job-title">
            Write a title for your job post
          </label>
          <input
            id="guided-job-title"
            v-model="form.title"
            type="text"
            class="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-500/20"
            placeholder=""
            autocomplete="off"
          />
          <p v-if="errors.title" class="text-sm text-red-600">{{ errors.title }}</p>
          <div class="rounded-lg border border-slate-200 bg-slate-50/80 px-4 py-3">
            <p class="text-sm font-medium text-slate-800">Example titles</p>
            <ul class="mt-2 list-disc space-y-1.5 pl-5 text-sm text-slate-600">
              <li>Build responsive WordPress site with booking/payment functionality</li>
              <li>Graphic designer needed to design ad creative for multiple campaigns</li>
              <li>Facebook ad specialist needed for product launch</li>
            </ul>
          </div>
        </div>

        <!-- Step 2: Skills (search + popular pills) -->
        <div v-else-if="step === 1" class="space-y-5">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-slate-700" for="guided-skill-search">
              Search skills or add your own
            </label>
            <div class="relative">
              <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                id="guided-skill-search"
                v-model="skillSearchQuery"
                type="text"
                :class="[
                  'w-full rounded-xl border bg-white py-2.5 pl-10 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2',
                  skillSearchQuery.trim() ? 'pr-20' : 'pr-10',
                  showSkillDropdown
                    ? 'border-slate-900 focus:border-slate-900 focus:ring-slate-900/15'
                    : 'border-slate-300 focus:border-green-600 focus:ring-green-500/20',
                ]"
                placeholder="Search or type a skill and press Enter"
                autocomplete="off"
                role="combobox"
                :aria-expanded="showSkillDropdown"
                aria-autocomplete="list"
                aria-controls="guided-skill-suggestions"
                @focus="onSkillSearchFocus"
                @blur="onSkillSearchBlur"
                @keydown.enter.prevent="addSkillFromSearch"
                @keydown.escape.prevent="onSkillSearchEscape"
              />
              <button
                v-if="skillSearchQuery.trim()"
                type="button"
                class="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                aria-label="Clear search"
                tabindex="-1"
                @mousedown.prevent="clearSkillSearch"
              >
                <span class="flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 bg-white hover:border-slate-400">
                  <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </span>
              </button>
              <div
                v-if="showSkillDropdown"
                id="guided-skill-suggestions"
                class="absolute left-0 right-0 top-full z-30 mt-1 max-h-60 overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
                role="listbox"
                @mousedown.prevent
              >
                <template v-if="skillDropdownSuggestions.length">
                  <button
                    v-for="s in skillDropdownSuggestions"
                    :key="s"
                    type="button"
                    role="option"
                    class="flex w-full px-4 py-2.5 text-left text-sm text-slate-800 hover:bg-slate-50"
                    @click="selectSkillFromDropdown(s)"
                  >
                    {{ s }}
                  </button>
                </template>
                <p v-else class="px-4 py-3 text-sm text-slate-500">
                  No matches — press <kbd class="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-xs">Enter</kbd> to add
                  “{{ skillSearchQuery.trim() }}”
                </p>
              </div>
            </div>
          </div>

          <p class="flex items-start gap-2 text-sm text-slate-600">
            <svg class="mt-0.5 h-4 w-4 shrink-0 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>For the best results, add 3–5 skills.</span>
          </p>

          <div v-if="form.skills.length" class="space-y-2">
            <p class="text-sm font-semibold text-slate-900">Selected skills</p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="(skill, i) in form.skills"
                :key="`sel-${i}-${skill}`"
                class="inline-flex items-center gap-2 rounded-full bg-black px-3 py-1.5 text-sm font-medium text-white"
              >
                {{ skill }}
                <button
                  type="button"
                  class="flex h-5 w-5 items-center justify-center rounded-full text-white hover:bg-white/15"
                  aria-label="Remove skill"
                  @click="form.skills.splice(i, 1)"
                >
                  <span class="text-base leading-none" aria-hidden="true">×</span>
                </button>
              </span>
            </div>
          </div>

          <div>
            <p class="text-sm font-semibold text-slate-900">{{ popularSkillsHeading }}</p>
            <div class="mt-3 flex flex-wrap gap-2">
              <button
                v-for="skill in filteredPopularSkills"
                :key="skill"
                type="button"
                class="inline-flex items-center gap-2 rounded-full border border-slate-900/25 bg-white px-3 py-1.5 text-sm font-medium text-slate-900 shadow-sm transition-colors hover:border-slate-900/40 hover:bg-slate-50"
                @click="addPopularSkill(skill)"
              >
                {{ skill }}
                <span class="text-base font-medium leading-none text-slate-900" aria-hidden="true">+</span>
              </button>
            </div>
          </div>

          <p v-if="errors.skills" class="text-sm text-red-600">{{ errors.skills }}</p>
        </div>

        <!-- Step 3: Scope (cards → duration → experience → contract-to-hire) -->
        <div v-else-if="step === 2" class="space-y-2">
          <!-- All choices made: four summary rows (images 1–2); Edit → image 3 -->
          <template
            v-if="
              scopePhase === 'scope_four_row_summary' &&
              form.scopeEstimate &&
              form.scopeDurationKey &&
              form.experienceLevel &&
              form.contractToHire
            "
          >
            <div class="relative rounded-xl border-2 border-slate-200 bg-white p-4 pr-14 shadow-sm">
              <button
                type="button"
                class="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-green-600 transition-colors hover:border-slate-300 hover:bg-slate-50"
                aria-label="Edit scope"
                @click="onOpenScopeContractEditMode"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <p class="text-sm font-semibold text-slate-900">{{ selectedScopeCard.label }}</p>
              <p class="mt-1 text-sm leading-relaxed text-slate-600">{{ selectedScopeCard.description }}</p>
            </div>
            <div class="relative mt-3 rounded-xl border-2 border-slate-200 bg-white p-4 pr-14 shadow-sm">
              <button
                type="button"
                class="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-green-600 transition-colors hover:border-slate-300 hover:bg-slate-50"
                aria-label="Edit duration"
                @click="onOpenScopeContractEditMode"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <p class="text-sm font-semibold text-slate-900">{{ selectedDurationLabel }}</p>
            </div>
            <div class="relative mt-3 rounded-xl border-2 border-slate-200 bg-white p-4 pr-14 shadow-sm">
              <button
                type="button"
                class="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-green-600 transition-colors hover:border-slate-300 hover:bg-slate-50"
                aria-label="Edit experience level"
                @click="onOpenScopeContractEditMode"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <p class="text-sm font-semibold text-slate-900">{{ experienceSummaryLabel }}</p>
            </div>
            <div class="relative mt-3 rounded-xl border-2 border-slate-200 bg-white p-4 pr-14 shadow-sm">
              <button
                type="button"
                class="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-green-600 transition-colors hover:border-slate-300 hover:bg-slate-50"
                aria-label="Edit contract-to-hire"
                @click="onOpenScopeContractEditMode"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <p class="text-sm font-semibold text-slate-900">{{ contractToHireSummaryLabel }}</p>
            </div>
          </template>

          <!-- Image 3: three rows + solid green Edit + contract radios -->
          <template
            v-else-if="
              scopePhase === 'scope_contract_summary' &&
              form.scopeEstimate &&
              form.scopeDurationKey &&
              form.experienceLevel
            "
          >
            <div class="relative rounded-xl border-2 border-slate-200 bg-white p-4 pr-14 shadow-sm">
              <button
                type="button"
                class="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-green-600 transition-colors hover:border-slate-300 hover:bg-slate-50"
                aria-label="Edit scope"
                @click="onScopeEditClick"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <p class="text-sm font-semibold text-slate-900">{{ selectedScopeCard.label }}</p>
              <p class="mt-1 text-sm leading-relaxed text-slate-600">{{ selectedScopeCard.description }}</p>
            </div>
            <div class="relative mt-3 rounded-xl border-2 border-slate-200 bg-white p-4 pr-14 shadow-sm">
              <button
                type="button"
                class="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-green-600 transition-colors hover:border-slate-300 hover:bg-slate-50"
                aria-label="Edit duration"
                @click="onDurationEditClick"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <p class="text-sm font-semibold text-slate-900">{{ selectedDurationLabel }}</p>
            </div>
            <div class="relative mt-3 rounded-xl border-2 border-slate-200 bg-white p-4 pr-14 shadow-sm">
              <button
                type="button"
                class="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-green-600 transition-colors hover:border-slate-300 hover:bg-slate-50"
                aria-label="Edit experience level"
                @click="onExperienceEditClick"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <p class="text-sm font-semibold text-slate-900">{{ experienceSummaryLabel }}</p>
            </div>
            <div class="mt-8 space-y-4">
              <div>
                <p class="text-base font-semibold text-slate-900">Is this job a contract-to-hire opportunity?</p>
                <p class="mt-1 text-sm leading-relaxed text-slate-600">
                  This helps set expectations with talent and won’t restrict who can submit proposals.
                </p>
              </div>
              <fieldset>
                <legend class="sr-only">Contract to hire</legend>
                <div class="space-y-3">
                  <label
                    :class="[
                      'flex cursor-pointer gap-3 rounded-xl border-2 p-4 transition-all',
                      form.contractToHire === 'yes' ? 'border-green-600 bg-green-50/40' : 'border-slate-200 hover:border-slate-300',
                    ]"
                  >
                    <input
                      v-model="form.contractToHire"
                      type="radio"
                      name="guided-contract-to-hire"
                      value="yes"
                      class="mt-1 size-4 shrink-0 border-slate-300 text-green-600 focus:ring-green-500"
                    />
                    <div class="min-w-0">
                      <p class="text-sm font-semibold text-slate-900">Yes, this could become full time</p>
                      <p class="mt-1 text-sm leading-relaxed text-slate-600">
                        After a trial period, you can pay a one-time fee to convert the contract.
                        <a
                          href="#"
                          class="font-medium text-green-600 underline decoration-green-600/35 underline-offset-2 hover:text-green-700"
                          @click.prevent
                        >Learn more</a>
                      </p>
                    </div>
                  </label>
                  <label
                    :class="[
                      'flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-all',
                      form.contractToHire === 'no' ? 'border-green-600 bg-green-50/40' : 'border-slate-200 hover:border-slate-300',
                    ]"
                  >
                    <input
                      v-model="form.contractToHire"
                      type="radio"
                      name="guided-contract-to-hire"
                      value="no"
                      class="size-4 shrink-0 border-slate-300 text-green-600 focus:ring-green-500"
                    />
                    <span class="text-sm font-semibold text-slate-900">No, not at this time</span>
                  </label>
                </div>
              </fieldset>
            </div>
          </template>

          <!-- After scope + duration: two summary rows + experience radios -->
          <template
            v-else-if="scopePhase === 'scope_duration_summary' && form.scopeEstimate && form.scopeDurationKey"
          >
            <div class="relative rounded-xl border-2 border-slate-200 bg-white p-4 pr-14 shadow-sm">
              <button
                type="button"
                class="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-green-600 transition-colors hover:border-slate-300 hover:bg-slate-50"
                aria-label="Edit scope"
                @click="onScopeEditClick"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <p class="text-sm font-semibold text-slate-900">{{ selectedScopeCard.label }}</p>
              <p class="mt-1 text-sm leading-relaxed text-slate-600">{{ selectedScopeCard.description }}</p>
            </div>
            <div class="relative mt-3 rounded-xl border-2 border-slate-200 bg-white p-4 pr-14 shadow-sm">
              <button
                type="button"
                class="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-green-600 transition-colors hover:border-slate-300 hover:bg-slate-50"
                aria-label="Edit duration"
                @click="onDurationEditClick"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <p class="text-sm font-semibold text-slate-900">{{ selectedDurationLabel }}</p>
            </div>
            <div class="mt-8 space-y-4">
              <div>
                <p class="text-base font-semibold text-slate-900">What level of experience will it need?</p>
                <p class="mt-1 text-sm leading-relaxed text-slate-600">
                  This won’t restrict any proposals, but helps match expertise to your budget.
                </p>
              </div>
              <fieldset>
                <legend class="sr-only">Experience level</legend>
                <div class="space-y-3">
                  <label
                    v-for="opt in experienceStepOptions"
                    :key="opt.value"
                    :class="[
                      'flex cursor-pointer gap-3 rounded-xl border-2 p-4 transition-all',
                      form.experienceLevel === opt.value ? 'border-green-600 bg-green-50/40' : 'border-slate-200 hover:border-slate-300',
                    ]"
                  >
                    <input
                      v-model="form.experienceLevel"
                      type="radio"
                      name="guided-experience-scope-step"
                      :value="opt.value"
                      class="mt-1 size-4 shrink-0 border-slate-300 text-green-600 focus:ring-green-500"
                    />
                    <div>
                      <p class="text-sm font-semibold text-slate-900">{{ opt.label }}</p>
                      <p class="mt-1 text-sm leading-relaxed text-slate-600">{{ opt.description }}</p>
                    </div>
                  </label>
                </div>
              </fieldset>
            </div>
          </template>

          <!-- After picking a card: summary + Edit + duration (same step, no route change) -->
          <template v-else-if="scopePhase === 'header_duration' && form.scopeEstimate">
            <div class="relative rounded-xl border-2 border-slate-200 bg-white p-4 pr-14 shadow-sm">
              <button
                type="button"
                class="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-green-600 transition-colors hover:border-slate-300 hover:bg-slate-50"
                aria-label="Edit scope"
                @click="onScopeEditClick"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <p class="text-sm font-semibold text-slate-900">{{ selectedScopeCard.label }}</p>
              <p class="mt-1 text-sm leading-relaxed text-slate-600">{{ selectedScopeCard.description }}</p>
            </div>
            <div class="pt-6">
              <p class="text-base font-semibold text-slate-900">How long will your work take?</p>
              <div class="mt-3 space-y-1">
                <label
                  v-for="d in durationOptionsForScope"
                  :key="d.value"
                  class="flex cursor-pointer items-center gap-3 rounded-lg py-2.5 pl-0.5 pr-2 hover:bg-slate-50"
                >
                  <input
                    v-model="form.scopeDurationKey"
                    type="radio"
                    name="guided-scope-duration"
                    :value="d.value"
                    class="size-4 shrink-0 border-slate-300 text-green-600 focus:ring-green-500"
                  />
                  <span class="text-sm text-slate-800">{{ d.label }}</span>
                </label>
              </div>
            </div>
          </template>

          <!-- Edit: all three scope cards + duration below (still same step) -->
          <template v-else-if="scopePhase === 'cards_and_duration'">
            <fieldset>
              <legend class="sr-only">Project scope</legend>
              <div class="space-y-3">
                <label
                  v-for="opt in scopeOptions"
                  :key="opt.value"
                  :class="[
                    'flex cursor-pointer gap-3 rounded-xl border-2 p-4 transition-all',
                    form.scopeEstimate === opt.value ? 'border-green-600 bg-green-50/40' : 'border-slate-200 hover:border-slate-300',
                  ]"
                >
                  <input
                    type="radio"
                    name="guided-scope-expanded"
                    :value="opt.value"
                    :checked="form.scopeEstimate === opt.value"
                    class="mt-1 size-4 shrink-0 border-slate-300 text-green-600 focus:ring-green-500"
                    @change="onScopeChangeExpanded(opt.value)"
                  />
                  <div>
                    <p class="text-sm font-semibold text-slate-900">{{ opt.label }}</p>
                    <p class="mt-1 text-sm leading-relaxed text-slate-600">{{ opt.description }}</p>
                  </div>
                </label>
              </div>
            </fieldset>
            <div v-if="form.scopeEstimate" class="pt-8">
              <p class="text-base font-semibold text-slate-900">How long will your work take?</p>
              <div class="mt-3 space-y-1">
                <label
                  v-for="d in durationOptionsForScope"
                  :key="d.value"
                  class="flex cursor-pointer items-center gap-3 rounded-lg py-2.5 pl-0.5 pr-2 hover:bg-slate-50"
                >
                  <input
                    v-model="form.scopeDurationKey"
                    type="radio"
                    name="guided-scope-duration-expanded"
                    :value="d.value"
                    class="size-4 shrink-0 border-slate-300 text-green-600 focus:ring-green-500"
                  />
                  <span class="text-sm text-slate-800">{{ d.label }}</span>
                </label>
              </div>
            </div>
          </template>

          <!-- Initial: only the three scope cards -->
          <template v-else>
            <fieldset>
              <legend class="sr-only">Project scope</legend>
              <div class="space-y-3">
                <label
                  v-for="opt in scopeOptions"
                  :key="opt.value"
                  :class="[
                    'flex cursor-pointer gap-3 rounded-xl border-2 p-4 transition-all',
                    form.scopeEstimate === opt.value ? 'border-green-600 bg-green-50/40' : 'border-slate-200 hover:border-slate-300',
                  ]"
                >
                  <input
                    type="radio"
                    name="guided-scope-initial"
                    :value="opt.value"
                    :checked="form.scopeEstimate === opt.value"
                    class="mt-1 size-4 shrink-0 border-slate-300 text-green-600 focus:ring-green-500"
                    @change="onScopeFirstPick(opt.value)"
                  />
                  <div>
                    <p class="text-sm font-semibold text-slate-900">{{ opt.label }}</p>
                    <p class="mt-1 text-sm leading-relaxed text-slate-600">{{ opt.description }}</p>
                  </div>
                </label>
              </div>
            </fieldset>
          </template>

          <p v-if="errors.scopeEstimate" class="text-sm text-red-600">{{ errors.scopeEstimate }}</p>
          <p v-if="errors.scopeDuration" class="text-sm text-red-600">{{ errors.scopeDuration }}</p>
          <p v-if="errors.experienceLevel" class="text-sm text-red-600">{{ errors.experienceLevel }}</p>
          <p v-if="errors.contractToHire" class="text-sm text-red-600">{{ errors.contractToHire }}</p>
        </div>

        <!-- Step 4: Budget (after scope — Upwork-style) -->
        <div v-else-if="step === 3" class="space-y-6">
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              v-for="type in budgetTypeOrder"
              :key="type"
              type="button"
              :class="[
                'flex min-h-[104px] flex-col rounded-xl border-2 p-4 text-left transition-all',
                form.budgetType === type ? 'border-slate-900 bg-white shadow-sm' : 'border-slate-200 hover:border-slate-300',
              ]"
              @click="onBudgetTypeSelect(type)"
            >
              <div class="flex items-start justify-between gap-2">
                <span class="text-slate-600" aria-hidden="true">
                  <!-- clock -->
                  <svg
                    v-if="type === 'hourly'"
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="1.5"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <!-- price tag -->
                  <svg
                    v-else
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="1.5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
                    />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 9h.008v.008H6V9z" />
                  </svg>
                </span>
                <span
                  :class="[
                    'flex size-4 shrink-0 items-center justify-center rounded-full border-2',
                    form.budgetType === type ? 'border-green-600 bg-green-600' : 'border-slate-300 bg-white',
                  ]"
                  aria-hidden="true"
                >
                  <span v-if="form.budgetType === type" class="size-1.5 rounded-full bg-white" />
                </span>
              </div>
              <p class="mt-auto pt-6 text-sm font-semibold text-slate-900">
                {{ type === 'hourly' ? 'Hourly rate' : 'Fixed price' }}
              </p>
            </button>
          </div>
          <p v-if="errors.budgetType" class="text-sm text-red-600">{{ errors.budgetType }}</p>

          <!-- Fixed price: single estimate + milestone copy -->
          <template v-if="form.budgetType === 'fixed'">
            <p class="text-sm leading-relaxed text-slate-600">
              Set a price for the project and pay at the end, or you can divide the project into milestones and pay as each
              milestone is completed.
            </p>
            <div class="space-y-2 pt-2">
              <p class="text-base font-semibold text-slate-900">What is the best cost estimate for your project?</p>
              <p class="text-sm leading-relaxed text-slate-600">
                You can negotiate this cost and create milestones when you chat with your freelancer.
              </p>
              <div class="max-w-xs pt-2">
                <label for="guided-fixed-estimate" class="sr-only">Best cost estimate for your project (USD)</label>
                <AppInput id="guided-fixed-estimate" v-model="form.budgetMin" type="number" placeholder="0">
                  <template #prefix>$</template>
                </AppInput>
              </div>
            </div>
            <p v-if="errors.budgetMin" class="text-sm text-red-600">{{ errors.budgetMin }}</p>
            <button
              type="button"
              class="text-sm font-medium text-green-600 underline decoration-green-600/35 underline-offset-2 hover:text-green-700"
              @click="applySuggestedFixedBudget"
            >
              Not ready to set a budget?
            </button>
          </template>

          <!-- Hourly: From / To + chart -->
          <template v-else>
            <div class="grid grid-cols-2 gap-4">
              <AppInput
                v-model="form.budgetMin"
                type="number"
                label="From"
                :placeholder="String(suggestedHourlyRange.min)"
              >
                <template #prefix>$</template>
                <template #suffix>/hr</template>
              </AppInput>
              <AppInput
                v-model="form.budgetMax"
                type="number"
                label="To"
                :placeholder="String(suggestedHourlyRange.max)"
              >
                <template #prefix>$</template>
                <template #suffix>/hr</template>
              </AppInput>
            </div>
            <p v-if="errors.budgetMin" class="text-sm text-red-600">{{ errors.budgetMin }}</p>
            <p v-if="errors.budgetMax" class="text-sm text-red-600">{{ errors.budgetMax }}</p>

            <div class="rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-4 sm:px-4">
              <p class="sr-only">Typical hourly rates for similar jobs</p>
              <div class="flex h-28 items-end justify-between gap-0.5 border-b border-slate-200/80 pb-0.5" role="presentation">
                <div
                  v-for="(bar, i) in budgetHistogramBars"
                  :key="i"
                  :class="[
                    'min-w-0 flex-1 rounded-t-sm transition-colors',
                    bar.highlight ? 'bg-green-500' : 'bg-emerald-100/90',
                  ]"
                  :style="{ height: `${bar.pct}%` }"
                />
              </div>
              <p class="mt-4 text-sm leading-relaxed text-slate-600">
                Professionals tend to charge ${{ suggestedHourlyRange.min }} – ${{ suggestedHourlyRange.max }} /hour (USD) for
                {{ budgetTalentBlurb }} projects like yours. Experts may charge higher rates.
              </p>
              <button
                type="button"
                class="mt-3 text-sm font-medium text-green-600 underline decoration-green-600/35 underline-offset-2 hover:text-green-700"
                @click="applySuggestedHourlyRange"
              >
                Not ready to set an hourly rate?
              </button>
            </div>
          </template>
        </div>

        <!-- Step 5: Description (Upwork-style conversation step) -->
        <div v-else-if="step === 4" class="space-y-5">
          <div>
            <label for="guided-description" class="mb-1.5 block text-sm font-semibold text-slate-900">
              Describe what you need
            </label>
            <textarea
              id="guided-description"
              v-model="form.description"
              rows="10"
              maxlength="50000"
              placeholder="Already have a description? Paste it here!"
              :class="[
                'w-full resize-y rounded-xl bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2',
                descriptionFieldInvalid
                  ? 'border border-red-500 focus:border-transparent focus:ring-red-500/25'
                  : 'border border-slate-300 focus:border-transparent focus:ring-green-500/25',
              ]"
              :aria-invalid="descriptionFieldInvalid"
              :aria-describedby="descriptionAriaDescribedBy"
            />
            <p class="mt-1 text-right text-xs text-slate-400">
              {{ descriptionCharsLeft.toLocaleString() }} characters left
            </p>
            <p
              v-if="descriptionLiveMessage"
              :id="DESCRIPTION_ERROR_ID"
              class="mt-2 flex items-start gap-2 text-sm text-red-600"
              role="alert"
            >
              <span
                class="mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold leading-none text-white"
                aria-hidden="true"
              >
                !
              </span>
              <span>{{ descriptionLiveMessage }}</span>
            </p>
          </div>
          <div>
            <p class="text-sm font-medium text-slate-800">Need help?</p>
            <a
              href="#"
              class="mt-1 inline-block text-sm font-medium text-green-600 underline decoration-green-600/35 underline-offset-2 hover:text-green-700"
              @click.prevent
            >
              See examples of effective descriptions
            </a>
          </div>
          <div>
            <input
              ref="describeFileInputRef"
              type="file"
              class="hidden"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip"
              @change="onDescribeAttachChange"
            />
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-green-600 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50"
              @click="describeFileInputRef?.click()"
            >
              <svg class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                />
              </svg>
              Attach file
            </button>
            <p class="mt-1.5 text-xs text-slate-500">Max file size: 100MB</p>
            <ul v-if="form.attachments.length" class="mt-3 space-y-2">
              <li
                v-for="(file, i) in form.attachments"
                :key="`${file.name}-${i}`"
                class="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800"
              >
                <span class="min-w-0 truncate">{{ file.name }}</span>
                <button
                  type="button"
                  class="shrink-0 text-slate-400 hover:text-red-600"
                  aria-label="Remove file"
                  @click="form.attachments.splice(i, 1)"
                >
                  ×
                </button>
              </li>
            </ul>
          </div>
        </div>

        <!-- Step 6: Review — Job details (single card; actions inside card) -->
        <div v-else class="space-y-6">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <h1 class="text-2xl font-bold tracking-tight text-neutral-900 sm:text-[1.625rem]">Job details</h1>
            <AppButton
              class="shrink-0 !rounded-lg !bg-[#14a800] !px-5 !py-2.5 text-sm font-medium !shadow-none hover:!bg-[#118f00] focus:!ring-[#14a800]/35"
              :loading="publishing"
              @click="publishJob"
            >
              Post this job
            </AppButton>
          </div>

          <div class="overflow-hidden rounded-[10px] border border-[#e0e0e0] bg-white shadow-sm">
            <!-- Title -->
            <div class="flex items-start justify-between gap-4 border-b border-[#e0e0e0] px-8 py-7 sm:px-10 sm:py-8">
              <p class="min-w-0 flex-1 text-xl font-bold leading-snug text-neutral-900 sm:text-2xl">
                {{ form.title || '—' }}
              </p>
              <button
                type="button"
                class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#d8d8d8] bg-white text-[#14a800] transition-colors hover:border-[#c4c4c4] hover:bg-[#fafafa] focus:outline-none focus:ring-2 focus:ring-[#14a800]/25 sm:h-9 sm:w-9"
                aria-label="Edit title"
                @click="goToGuidedStep(0)"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>
            </div>

            <!-- Description -->
            <div class="flex items-start justify-between gap-4 border-b border-[#e0e0e0] px-8 py-7 sm:px-10 sm:py-8">
              <p class="min-w-0 flex-1 whitespace-pre-wrap text-sm font-normal leading-relaxed text-neutral-800">
                {{ form.description || '—' }}
              </p>
              <button
                type="button"
                class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#d8d8d8] bg-white text-[#14a800] transition-colors hover:border-[#c4c4c4] hover:bg-[#fafafa] focus:outline-none focus:ring-2 focus:ring-[#14a800]/25 sm:h-9 sm:w-9"
                aria-label="Edit description"
                @click="goToGuidedStep(4)"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>
            </div>

            <!-- Category -->
            <div class="border-b border-[#e0e0e0] px-8 py-7 sm:px-10 sm:py-8">
              <div class="flex items-start justify-between gap-4">
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-bold text-neutral-900">Category</p>
                  <p class="mt-2 text-sm font-normal leading-relaxed text-neutral-800">{{ categoryDisplayLabel }}</p>
                  <div v-if="reviewCategoryEditing" class="mt-3 max-w-md">
                    <AppSelect v-model="form.category" label="" :options="categoryOptions" placeholder="Select" />
                  </div>
                  <p v-if="errors.category" class="mt-2 text-sm text-red-600">{{ errors.category }}</p>
                </div>
                <button
                  type="button"
                  class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#d8d8d8] bg-white text-[#14a800] transition-colors hover:border-[#c4c4c4] hover:bg-[#fafafa] focus:outline-none focus:ring-2 focus:ring-[#14a800]/25 sm:h-9 sm:w-9"
                  aria-label="Edit category"
                  @click="reviewCategoryEditing = !reviewCategoryEditing"
                >
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Skills -->
            <div class="flex items-start justify-between gap-4 border-b border-[#e0e0e0] px-8 py-7 sm:px-10 sm:py-8">
              <div class="min-w-0 flex-1">
                <p class="text-sm font-bold text-neutral-900">Skills</p>
                <p class="mt-2 text-sm font-normal leading-relaxed text-neutral-800">{{ form.skills.join(', ') || '—' }}</p>
              </div>
              <button
                type="button"
                class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#d8d8d8] bg-white text-[#14a800] transition-colors hover:border-[#c4c4c4] hover:bg-[#fafafa] focus:outline-none focus:ring-2 focus:ring-[#14a800]/25 sm:h-9 sm:w-9"
                aria-label="Edit skills"
                @click="goToGuidedStep(1)"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>
            </div>

            <!-- Scope (single line like Upwork) -->
            <div class="flex items-start justify-between gap-4 border-b border-[#e0e0e0] px-8 py-7 sm:px-10 sm:py-8">
              <div class="min-w-0 flex-1">
                <p class="text-sm font-bold text-neutral-900">Scope</p>
                <p class="mt-2 text-sm font-normal leading-relaxed text-neutral-800">{{ scopeCombinedReviewLine }}</p>
              </div>
              <button
                type="button"
                class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#d8d8d8] bg-white text-[#14a800] transition-colors hover:border-[#c4c4c4] hover:bg-[#fafafa] focus:outline-none focus:ring-2 focus:ring-[#14a800]/25 sm:h-9 sm:w-9"
                aria-label="Edit scope"
                @click="goToGuidedStep(2)"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>
            </div>

            <!-- Budget -->
            <div class="flex items-start justify-between gap-4 border-b border-[#e0e0e0] px-8 py-7 sm:px-10 sm:py-8">
              <div class="min-w-0 flex-1">
                <p class="text-sm font-bold text-neutral-900">Budget</p>
                <p class="mt-2 text-sm font-normal leading-relaxed text-neutral-800">{{ budgetReviewLine }}</p>
              </div>
              <button
                type="button"
                class="review-edit-btn"
                aria-label="Edit budget"
                @click="goToGuidedStep(3)"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>
            </div>

            <!-- Screening questions (accordion) -->
            <div class="border-b border-[#e0e0e0]">
              <button
                type="button"
                class="flex w-full items-center justify-between gap-4 px-8 py-7 text-left transition-colors hover:bg-neutral-50/80 sm:px-10 sm:py-8"
                :aria-expanded="reviewScreeningOpen"
                @click="reviewScreeningOpen = !reviewScreeningOpen"
              >
                <div class="min-w-0">
                  <p class="text-sm font-bold text-neutral-900">Screening questions (optional)</p>
                  <p class="mt-2 text-sm leading-snug text-neutral-500">Narrow down your candidates</p>
                </div>
                <svg
                  class="h-5 w-5 shrink-0 text-neutral-500 transition-transform"
                  :class="reviewScreeningOpen ? 'rotate-180' : ''"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                  aria-hidden="true"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div v-show="reviewScreeningOpen" class="space-y-3 border-t border-[#e0e0e0] bg-[#fafafa] px-8 py-5 sm:px-10">
                <div class="flex justify-end">
                  <AppButton variant="outline" size="sm" @click="addQuestion">+ Add</AppButton>
                </div>
                <div class="space-y-2">
                  <div v-for="(q, i) in form.questions" :key="i" class="flex gap-2">
                    <input
                      v-model="q.question"
                      type="text"
                      class="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                      :placeholder="`Question ${i + 1}`"
                    />
                    <label class="flex shrink-0 items-center gap-1 text-xs text-slate-500">
                      <input v-model="q.required" type="checkbox" class="rounded text-green-600" />
                      Required
                    </label>
                    <button type="button" class="text-slate-400 hover:text-red-500" @click="form.questions.splice(i, 1)">×</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Advanced preferences (accordion) -->
            <div>
              <button
                type="button"
                class="flex w-full items-center justify-between gap-4 px-8 py-7 text-left transition-colors hover:bg-neutral-50/80 sm:px-10 sm:py-8"
                :aria-expanded="reviewAdvancedOpen"
                @click="reviewAdvancedOpen = !reviewAdvancedOpen"
              >
                <div class="min-w-0">
                  <p class="text-sm font-bold text-neutral-900">Advanced preferences (optional)</p>
                  <p class="mt-2 text-sm leading-snug text-neutral-500">Hours per week, hire date, and more</p>
                </div>
                <svg
                  class="h-5 w-5 shrink-0 text-neutral-500 transition-transform"
                  :class="reviewAdvancedOpen ? 'rotate-180' : ''"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                  aria-hidden="true"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div v-show="reviewAdvancedOpen" class="space-y-4 border-t border-[#e0e0e0] bg-[#fafafa] px-8 py-5 sm:px-10">
                <div class="flex items-center gap-2">
                  <input
                    id="guided-remote-review"
                    v-model="form.isRemote"
                    type="checkbox"
                    class="size-4 rounded border-slate-300 text-green-600 focus:ring-green-500"
                  />
                  <label for="guided-remote-review" class="text-sm text-slate-700">This is a remote job</label>
                </div>
                <div v-if="form.attachments.length" class="text-sm text-slate-700">
                  <span class="font-medium text-slate-900">Attachments:</span>
                  {{ form.attachments.map((f) => f.name).join(', ') }}
                </div>
                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-700">Visibility</label>
                  <div class="space-y-2">
                    <label
                      v-for="opt in visibilityOptions"
                      :key="opt.value"
                      :class="[
                        'flex cursor-pointer items-start gap-3 rounded-xl border-2 bg-white p-3 transition-all',
                        form.visibility === opt.value ? 'border-green-600 bg-green-50' : 'border-slate-200 hover:border-slate-300',
                      ]"
                    >
                      <input v-model="form.visibility" type="radio" :value="opt.value" class="mt-0.5 text-green-600 focus:ring-green-500" />
                      <div>
                        <p class="text-sm font-medium text-slate-900">{{ opt.label }}</p>
                        <p class="text-xs text-slate-500">{{ opt.description }}</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- In-card footer (reference layout — not the global sticky bar) -->
            <div
              class="flex flex-wrap items-center justify-between gap-4 border-t border-[#e0e0e0] bg-white px-8 py-7 sm:px-10 sm:py-8"
            >
              <AppButton
                variant="outline"
                class="!rounded-lg !border-[#d0d0d0] !bg-white !px-5 !py-2.5 !text-sm !font-medium !text-[#14a800] !shadow-none hover:!bg-[#f7f7f7] focus:!ring-[#14a800]/25"
                @click="goBack"
              >
                Back
              </AppButton>
              <div class="flex flex-wrap items-center justify-end gap-6">
                <button
                  type="button"
                  class="text-sm font-medium text-[#14a800] hover:text-[#118f00]"
                  @click="saveAsDraft"
                >
                  Save as a draft
                </button>
                <AppButton
                  class="!rounded-lg !bg-[#14a800] !px-5 !py-2.5 text-sm font-medium !shadow-none hover:!bg-[#118f00] focus:!ring-[#14a800]/35"
                  :loading="publishing"
                  @click="publishJob"
                >
                  Post this job
                </AppButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>

    <!-- Sticky footer: hidden on Job details review — actions live inside the card -->
    <footer
      v-if="step !== 5"
      class="sticky bottom-0 z-10 mt-auto border-t border-slate-200 bg-white shadow-[0_-4px_24px_rgba(15,23,42,0.06)]"
    >
      <div class="mx-auto max-w-6xl px-6 py-4 sm:px-8">
        <div class="mb-3 h-1 w-full overflow-hidden rounded-full bg-slate-200">
          <div class="h-full rounded-full bg-slate-900 transition-all duration-300" :style="{ width: progressPct }" />
        </div>
        <div class="flex flex-wrap items-center justify-between gap-4">
          <AppButton
            variant="outline"
            class="!border-green-600 !text-green-700 hover:!bg-green-50"
            @click="goBack"
          >
            Back
          </AppButton>
          <AppButton
            v-if="step < 5"
            :disabled="!canGoNext"
            @click="goNext"
          >
            {{ nextButtonLabel }}
          </AppButton>
        </div>
      </div>
    </footer>
    </div>

    <Teleport to="body">
      <Transition name="post-review-modal">
        <div
          v-if="postReviewInfoModalOpen"
          class="fixed inset-0 z-[60] flex items-center justify-center p-4"
          role="presentation"
        >
          <button
            type="button"
            class="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"
            aria-label="Close dialog"
            @click="postReviewInfoModalOpen = false"
          />
          <div
            class="relative z-10 w-full max-w-md rounded-2xl bg-white px-6 pb-8 pt-10 shadow-2xl sm:px-8"
            role="dialog"
            aria-modal="true"
            aria-labelledby="post-review-modal-title"
          >
            <button
              type="button"
              class="absolute right-3 top-3 rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close"
              @click="postReviewInfoModalOpen = false"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div class="mx-auto mb-6 flex h-24 w-24 items-center justify-center text-green-600" aria-hidden="true">
              <svg class="h-full w-full" viewBox="0 0 120 120" fill="none">
                <rect x="28" y="16" width="64" height="88" rx="8" stroke="currentColor" stroke-width="2.5" fill="white" />
                <path d="M44 20h32v8H44v-8z" fill="currentColor" opacity="0.2" />
                <path d="M40 36h40" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.35" />
                <circle cx="48" cy="56" r="6" fill="currentColor" />
                <path d="M58 56l8 8 16-16" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                <circle cx="48" cy="78" r="6" fill="currentColor" />
                <path d="M58 78l8 8 16-16" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                <circle cx="48" cy="100" r="6" fill="currentColor" />
                <path d="M58 100l10 10" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
              </svg>
            </div>
            <h2 id="post-review-modal-title" class="text-center text-xl font-bold tracking-tight text-slate-900">
              What happens after you post your job?
            </h2>
            <p class="mt-4 text-center text-sm leading-relaxed text-slate-600">
              You'll receive proposals and you can invite talent to your job. No charges until you hire.
            </p>
            <div class="mt-8 flex items-center justify-between gap-4 border-t border-slate-100 pt-6">
              <button
                type="button"
                class="text-sm font-semibold text-green-600 hover:text-green-700"
                @click="postReviewInfoModalOpen = false"
              >
                Edit job post
              </button>
              <AppButton @click="onPostReviewModalConfirm">Post your job</AppButton>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useJobStore } from '@/stores/job.store'
import { useToastStore } from '@/stores/toast.store'
import AppInput from '@/components/ui/AppInput.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import AppButton from '@/components/ui/AppButton.vue'
import PublicNavbar from '@/components/layout/PublicNavbar.vue'

const router = useRouter()
const auth = useAuthStore()
const jobStore = useJobStore()
const toast = useToastStore()

type ScopeDurationKey = 'gt6' | '3to6' | '1to3' | 'lt1'
type ScopePhase =
  | 'cards_only'
  | 'header_duration'
  | 'cards_and_duration'
  | 'scope_duration_summary'
  | 'scope_contract_summary'
  | 'scope_four_row_summary'

const step = ref(0)
/** Scope step UI: initial cards → compact header + duration → Edit shows all cards + duration. */
const scopePhase = ref<ScopePhase>('cards_only')
const publishing = ref(false)
/** Shown when entering Job details step (after “Review Job Post”) */
const postReviewInfoModalOpen = ref(false)
const reviewCategoryEditing = ref(false)
const reviewScreeningOpen = ref(false)
const reviewAdvancedOpen = ref(false)
const skillSearchQuery = ref('')
const skillSearchFocused = ref(false)
let skillSearchBlurTimer: ReturnType<typeof setTimeout> | undefined
const verifyBannerDismissed = ref(false)

/** Shown as quick-add pills on the skills step (web / full-stack bias + design variant). */
/** Order matches default “Full Stack” popular row; search dropdown uses full index separately. */
const POPULAR_SKILLS_WEB = [
  'WordPress',
  'Web Development',
  'JavaScript',
  'HTML',
  'PHP',
  'HTML5',
  'Web Design',
  'API',
  'jQuery',
  'Web Application',
  'CSS 3',
  'Custom PHP',
  'MySQL',
  'Bootstrap',
  'API Integration',
  'Node.js',
  'Database Architecture',
  'AngularJS',
  'React',
  'Vue.js',
  'TypeScript',
  'REST API',
  'Java',
  'Adobe XD',
  'Landing Page',
]

const POPULAR_SKILLS_DESIGN = [
  'Figma',
  'Adobe Photoshop',
  'Illustrator',
  'UI Design',
  'UX Design',
  'Graphic Design',
  'Logo Design',
  'Brand Identity',
  'Adobe XD',
  'Web Design',
  'Illustration',
  'Procreate',
  'Canva',
  'Typography',
  'Print Design',
]

const POPULAR_SKILLS_MOBILE = [
  'Swift',
  'Kotlin',
  'React Native',
  'Flutter',
  'iOS Development',
  'Android Development',
  'Java',
  'Firebase',
  'Mobile UI Design',
  'REST API',
  'Dart',
  'Objective-C',
  'Xcode',
  'Android Studio',
]

/** Extra labels for search dropdown (merged with popular lists). */
const EXTRA_SKILL_SUGGESTIONS = [
  'JavaScript',
  'CSS',
  'CSS Grid',
  'CSS 3',
  'Tailwind CSS',
  'SCSS',
  'Sass',
  'Less',
  'PostCSS',
  'Stylus',
  'CSS Framework',
  'Styled Components',
  'Webpack',
  'Vite',
  'Next.js',
  'Nuxt',
  'Redux',
  'GraphQL',
  'MongoDB',
  'PostgreSQL',
  'Docker',
  'Kubernetes',
  'AWS',
  'Google Cloud',
  'Azure',
  'SEO',
  'Content Writing',
  'Copywriting',
  'Video Editing',
  'Motion Graphics',
  '3D Modeling',
  'Blender',
  'Unity',
  'Unreal Engine',
  'NCSS Statistical Software',
]

function buildSkillSearchIndex(): string[] {
  const u = new Set<string>()
  for (const s of [
    ...POPULAR_SKILLS_WEB,
    ...POPULAR_SKILLS_DESIGN,
    ...POPULAR_SKILLS_MOBILE,
    ...EXTRA_SKILL_SUGGESTIONS,
  ]) {
    u.add(s)
  }
  return Array.from(u)
}

const SKILL_SEARCH_INDEX = buildSkillSearchIndex()

onBeforeUnmount(() => {
  if (skillSearchBlurTimer !== undefined) clearTimeout(skillSearchBlurTimer)
})

const errors = reactive<Record<string, string>>({})

const form = reactive({
  title: '',
  description: '',
  category: '',
  experienceLevel: '',
  /** Set from scope step: short | medium | long */
  projectLength: '',
  /** large | medium | small — chosen on scope step */
  scopeEstimate: '' as '' | 'large' | 'medium' | 'small',
  /** Duration radios on scope step; mapped with scope to projectLength on Next. */
  scopeDurationKey: '' as '' | ScopeDurationKey,
  /** Contract-to-hire step (after experience); not sent to API until backend supports it */
  contractToHire: '' as '' | 'yes' | 'no',
  isRemote: true,
  budgetType: 'hourly' as 'fixed' | 'hourly',
  budgetMin: 13,
  budgetMax: 30,
  skills: [] as string[],
  questions: [] as { question: string; required: boolean }[],
  visibility: 'public' as 'public' | 'invite_only' | 'private',
  attachments: [] as File[],
})

const stepCopy = computed(() => {
  const copies = [
    {
      title: 'Let’s start with a strong title.',
      body: 'This helps your job post stand out to the right candidates. It’s the first thing they’ll see, so make it count!',
    },
    {
      title: 'What are the main skills required for your work?',
      body: 'Search, pick from popular skills, or add your own. Strong skill tags help the right freelancers find your post.',
    },
    {
      title: 'Next, estimate the scope of your work.',
      body: 'Consider the size of your project and the time it will take.',
    },
    {
      title: 'Tell us about your budget.',
      body: 'This will help us match you to talent within your range.',
    },
    {
      title: 'Start the conversation.',
      body: 'Talent are looking for clear expectations, the right skills, good communication, and how you like to work.',
    },
    {
      title: 'Review and publish.',
      body: 'Double-check the basics, set visibility, then publish when you’re ready.',
    },
  ]
  return copies[step.value] ?? copies[0]
})

const scopeOptions = [
  {
    value: 'large' as const,
    label: 'Large',
    description: 'Longer term or complex initiatives (ex. design and build a full website)',
  },
  {
    value: 'medium' as const,
    label: 'Medium',
    description: 'Well-defined projects (ex. a landing page)',
  },
  {
    value: 'small' as const,
    label: 'Small',
    description: 'Quick and straightforward tasks (ex. update text and images on a webpage)',
  },
]

const scopeReviewLabel = computed(() => {
  const o = scopeOptions.find((x) => x.value === form.scopeEstimate)
  return o ? o.label : '—'
})

const durationOptionsForScope = computed(() => {
  const s = form.scopeEstimate
  if (s === 'large' || s === 'medium') {
    return [
      { value: 'gt6' as const, label: 'More than 6 months' },
      { value: '3to6' as const, label: '3 to 6 months' },
      { value: '1to3' as const, label: '1 to 3 months' },
    ]
  }
  if (s === 'small') {
    return [
      { value: '3to6' as const, label: '3 to 6 months' },
      { value: '1to3' as const, label: '1 to 3 months' },
      { value: 'lt1' as const, label: 'Less than 1 month' },
    ]
  }
  return [] as { value: ScopeDurationKey; label: string }[]
})

const selectedScopeCard = computed(() => {
  const o = scopeOptions.find((x) => x.value === form.scopeEstimate)
  return o ?? scopeOptions[0]
})

const selectedDurationLabel = computed(() => {
  const dk = form.scopeDurationKey
  if (!dk) return '—'
  const list = durationOptionsForScope.value
  const o = list.find((x) => x.value === dk)
  return o?.label ?? '—'
})

const experienceStepOptions = [
  {
    value: 'entry' as const,
    label: 'Entry',
    summaryTitle: 'Entry level',
    description: 'Looking for someone relatively new to this field',
  },
  {
    value: 'intermediate' as const,
    label: 'Intermediate',
    summaryTitle: 'Intermediate level',
    description: 'Looking for substantial experience in this field',
  },
  {
    value: 'expert' as const,
    label: 'Expert',
    summaryTitle: 'Expert level',
    description: 'Looking for comprehensive and deep expertise in this field',
  },
]

const experienceSummaryLabel = computed(() => {
  const o = experienceStepOptions.find((x) => x.value === form.experienceLevel)
  return o ? o.summaryTitle : '—'
})

const experienceReviewLabel = computed(() => {
  const o = experienceStepOptions.find((x) => x.value === form.experienceLevel)
  return o ? o.summaryTitle : '—'
})

/** 4-row summary + review (images 1–2) */
const contractToHireSummaryLabel = computed(() => {
  if (form.contractToHire === 'yes') return 'Contract-to-hire opportunity'
  if (form.contractToHire === 'no') return 'Not planning to hire full time'
  return '—'
})

const contractToHireReviewLabel = computed(() => contractToHireSummaryLabel.value)

function formatUsdAmount(n: number): string {
  if (!Number.isFinite(n)) return '0.00'
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const scopeCombinedReviewLine = computed(() => {
  const parts = [
    scopeReviewLabel.value,
    selectedDurationLabel.value,
    experienceReviewLabel.value,
    contractToHireReviewLabel.value,
  ].filter((p) => p && p !== '—')
  return parts.length ? parts.join(', ') : '—'
})

const budgetReviewLine = computed(() => {
  const min = formatUsdAmount(Number(form.budgetMin))
  const max = formatUsdAmount(Number(form.budgetMax))
  if (form.budgetType === 'hourly') return `$${min} - $${max} /hr`
  return min === max ? `$${min} fixed` : `$${min} - $${max} fixed`
})

function isDurationValidForScope(
  scope: '' | 'large' | 'medium' | 'small',
  dk: ScopeDurationKey | '',
): boolean {
  if (!scope || !dk) return false
  if (scope === 'large' || scope === 'medium') {
    return dk === 'gt6' || dk === '3to6' || dk === '1to3'
  }
  if (scope === 'small') {
    return dk === '3to6' || dk === '1to3' || dk === 'lt1'
  }
  return false
}

function syncScopeStepPhaseFromForm() {
  if (!form.scopeEstimate) {
    scopePhase.value = 'cards_only'
    return
  }
  if (!form.scopeDurationKey || !isDurationValidForScope(form.scopeEstimate, form.scopeDurationKey)) {
    scopePhase.value = 'header_duration'
    return
  }
  if (!form.experienceLevel) {
    scopePhase.value = 'scope_duration_summary'
    return
  }
  if (!form.contractToHire) {
    scopePhase.value = 'scope_contract_summary'
    return
  }
  scopePhase.value = 'scope_four_row_summary'
}

watch(step, (s) => {
  if (s === 5) {
    postReviewInfoModalOpen.value = true
    reviewCategoryEditing.value = false
  }
  if (s !== 2) return
  syncScopeStepPhaseFromForm()
})

watch(
  () => form.scopeDurationKey,
  (dk) => {
    if (!dk || !form.scopeEstimate) return
    if (!isDurationValidForScope(form.scopeEstimate, dk as ScopeDurationKey)) return
    if (scopePhase.value === 'header_duration' || scopePhase.value === 'cards_and_duration') {
      if (!form.experienceLevel) {
        scopePhase.value = 'scope_duration_summary'
      } else if (!form.contractToHire) {
        scopePhase.value = 'scope_contract_summary'
      } else {
        scopePhase.value = 'scope_four_row_summary'
      }
    }
  },
)

watch(
  () => form.experienceLevel,
  (exp) => {
    if (!exp) return
    if (scopePhase.value === 'scope_duration_summary') {
      scopePhase.value = form.contractToHire ? 'scope_four_row_summary' : 'scope_contract_summary'
    }
  },
)

watch(
  () => form.contractToHire,
  (v) => {
    if (!v) return
    if (scopePhase.value === 'scope_contract_summary') {
      scopePhase.value = 'scope_four_row_summary'
    }
  },
)

function mapScopeDurationToProjectLength(
  scope: 'large' | 'medium' | 'small',
  dk: ScopeDurationKey,
): 'short' | 'medium' | 'long' {
  if (scope === 'large') {
    if (dk === 'gt6' || dk === '3to6') return 'long'
    if (dk === '1to3') return 'medium'
  }
  if (scope === 'medium') {
    if (dk === 'gt6') return 'long'
    if (dk === '3to6' || dk === '1to3') return 'medium'
  }
  if (scope === 'small') {
    if (dk === '3to6') return 'medium'
    if (dk === '1to3' || dk === 'lt1') return 'short'
  }
  return 'medium'
}

function onScopeFirstPick(val: 'large' | 'medium' | 'small') {
  const changed = form.scopeEstimate !== val
  form.scopeEstimate = val
  if (changed) {
    form.scopeDurationKey = ''
    form.contractToHire = ''
  }
  scopePhase.value = 'header_duration'
}

function onScopeChangeExpanded(val: 'large' | 'medium' | 'small') {
  const prev = form.scopeEstimate
  form.scopeEstimate = val
  if (prev !== val) {
    form.scopeDurationKey = ''
    form.contractToHire = ''
  }
  syncScopeStepPhaseFromForm()
}

/** From 4-row summary (images 1–2): open 3 rows + contract radios (image 3). */
function onOpenScopeContractEditMode() {
  scopePhase.value = 'scope_contract_summary'
}

function onScopeEditClick() {
  scopePhase.value = 'cards_and_duration'
}

function onDurationEditClick() {
  scopePhase.value = 'header_duration'
}

function onExperienceEditClick() {
  scopePhase.value = 'scope_duration_summary'
}

const showVerifyBanner = computed(
  () => !verifyBannerDismissed.value && auth.user && !auth.user.isEmailVerified,
)

const popularSkillsPool = computed(() => {
  const t = form.title.toLowerCase()
  if (t.includes('mobile') || t.includes('ios') || t.includes('android')) {
    return POPULAR_SKILLS_MOBILE
  }
  if (
    t.includes('design') ||
    t.includes('graphic') ||
    t.includes('logo') ||
    /\bui\b/.test(t) ||
    t.includes('ux') ||
    t.includes('brand') ||
    t.includes('illustrat')
  ) {
    return POPULAR_SKILLS_DESIGN
  }
  return POPULAR_SKILLS_WEB
})

const popularSkillsHeading = computed(() => {
  const t = form.title.toLowerCase()
  if (t.includes('mobile') || t.includes('ios') || t.includes('android')) {
    return 'Popular skills for Mobile Development'
  }
  if (
    t.includes('design') ||
    t.includes('graphic') ||
    t.includes('logo') ||
    t.includes('brand') ||
    t.includes('illustrat')
  ) {
    return 'Popular skills for Design & Creative'
  }
  return 'Popular skills for Full Stack Development'
})

/** Popular pills always show the full pool (minus already selected) — not filtered by search. */
const filteredPopularSkills = computed(() =>
  popularSkillsPool.value.filter((s) => !form.skills.includes(s)),
)

function rankSkillMatch(queryLc: string, skill: string): number {
  const s = skill.toLowerCase()
  if (s === queryLc) return 0
  if (s.startsWith(queryLc)) return 1
  return 2
}

/** Typeahead list under the search field (excludes already selected). */
const skillDropdownSuggestions = computed(() => {
  const q = skillSearchQuery.value.trim().toLowerCase()
  if (!q) return []
  const taken = new Set(form.skills)
  const matches = SKILL_SEARCH_INDEX.filter((s) => !taken.has(s) && s.toLowerCase().includes(q))
  matches.sort((a, b) => {
    const ra = rankSkillMatch(q, a)
    const rb = rankSkillMatch(q, b)
    if (ra !== rb) return ra - rb
    return a.localeCompare(b)
  })
  return matches.slice(0, 60)
})

const showSkillDropdown = computed(
  () => skillSearchFocused.value && skillSearchQuery.value.trim().length > 0,
)

/** Shown as “n/5”: six internal screens, but review shares step 5 with describe (Upwork-style). */
const GUIDED_JOB_POST_STEP_TOTAL = 5
const guidedStepDisplay = computed(() => Math.min(step.value + 1, GUIDED_JOB_POST_STEP_TOTAL))

const progressPct = computed(
  () => `${(guidedStepDisplay.value / GUIDED_JOB_POST_STEP_TOTAL) * 100}%`,
)

const budgetTypeOrder = ['hourly', 'fixed'] as const

const suggestedHourlyRange = computed(() => {
  const t = form.title.toLowerCase()
  if (t.includes('mobile') || t.includes('ios') || t.includes('android')) {
    return { min: 25, max: 50 }
  }
  if (
    t.includes('design') ||
    t.includes('graphic') ||
    t.includes('logo') ||
    /\bui\b/.test(t) ||
    t.includes('ux') ||
    t.includes('brand') ||
    t.includes('illustrat')
  ) {
    return { min: 20, max: 45 }
  }
  return { min: 13, max: 30 }
})

const budgetTalentBlurb = computed(() => {
  const t = form.title.toLowerCase()
  if (t.includes('mobile') || t.includes('ios') || t.includes('android')) {
    return 'mobile development'
  }
  if (
    t.includes('design') ||
    t.includes('graphic') ||
    t.includes('logo') ||
    /\bui\b/.test(t) ||
    t.includes('ux') ||
    t.includes('brand') ||
    t.includes('illustrat')
  ) {
    return 'design'
  }
  return 'full stack development'
})

const BUDGET_HIST_X_MAX = 80
const BUDGET_HIST_BUCKETS = 16

const budgetHistogramBars = computed(() => {
  const s = suggestedHourlyRange.value
  const rawMin = Number(form.budgetMin)
  const rawMax = Number(form.budgetMax)
  const effMin = Number.isFinite(rawMin) && rawMin > 0 ? rawMin : s.min
  const effMax = Number.isFinite(rawMax) && rawMax > 0 ? rawMax : s.max
  const lo = Math.min(effMin, effMax)
  const hi = Math.max(effMin, effMax)
  const heights = [18, 32, 52, 68, 80, 88, 94, 98, 96, 90, 80, 65, 48, 34, 24, 16]
  const span = BUDGET_HIST_X_MAX / BUDGET_HIST_BUCKETS
  return heights.map((pct, i) => {
    const bucketLo = i * span
    const bucketHi = (i + 1) * span
    const highlight = bucketHi > lo && bucketLo < hi
    return { pct, highlight }
  })
})

function applySuggestedHourlyRange() {
  form.budgetType = 'hourly'
  const r = suggestedHourlyRange.value
  form.budgetMin = r.min
  form.budgetMax = r.max
}

function onBudgetTypeSelect(type: 'hourly' | 'fixed') {
  if (form.budgetType === type) return
  if (type === 'fixed') {
    form.budgetType = 'fixed'
    form.budgetMin = 0
    form.budgetMax = 0
  } else {
    form.budgetType = 'hourly'
    const r = suggestedHourlyRange.value
    form.budgetMin = r.min
    form.budgetMax = r.max
  }
}

function applySuggestedFixedBudget() {
  form.budgetType = 'fixed'
  form.budgetMin = 1500
  form.budgetMax = 1500
}

watch(
  () => form.budgetMin,
  () => {
    if (form.budgetType !== 'fixed') return
    const n = Number(form.budgetMin)
    form.budgetMax = Number.isFinite(n) ? n : 0
  },
)

const nextButtonLabel = computed(() => {
  const labels = ['Next: Skills', 'Next: Scope', 'Next: Budget', 'Next: Description', 'Review Job Post']
  return labels[step.value] ?? 'Next'
})

const categoryOptions = [
  { label: 'Full Stack Development', value: 'full-stack-development' },
  { label: 'Web Development', value: 'web-development' },
  { label: 'Mobile Apps', value: 'mobile-apps' },
  { label: 'Design & Creative', value: 'design' },
  { label: 'Writing & Content', value: 'writing' },
  { label: 'Data Science', value: 'data-science' },
]

const categoryDisplayLabel = computed(() => {
  const c = categoryOptions.find((o) => o.value === form.category)
  return c?.label ?? '—'
})

const visibilityOptions = [
  { value: 'public', label: 'Public', description: 'Any freelancer can see and apply' },
  { value: 'invite_only', label: 'Invite only', description: 'Only invited freelancers can apply' },
  { value: 'private', label: 'Private', description: 'Save as a private draft' },
]

function clearErrors() {
  Object.keys(errors).forEach((k) => delete errors[k])
}

const DESCRIBE_MAX_CHARS = 50000
/** Minimum length before “Review Job Post” is enabled */
const DESCRIBE_MIN_CHARS = 50

const describeFileInputRef = ref<HTMLInputElement | null>(null)

const descriptionCharsLeft = computed(() =>
  Math.max(0, DESCRIBE_MAX_CHARS - (form.description?.length ?? 0)),
)

const descriptionTrimLen = computed(() => (form.description ?? '').trim().length)

/** Live validation on step 5 (index 4): empty → required; 1–49 trimmed → min length; ≥50 → neutral (reference UI). */
const descriptionLiveMessage = computed(() => {
  if (step.value !== 4) return ''
  if (descriptionTrimLen.value === 0) return 'Description is required'
  if (descriptionTrimLen.value < DESCRIBE_MIN_CHARS) return 'Must be more than 50 characters'
  return ''
})

const descriptionFieldInvalid = computed(() => descriptionLiveMessage.value.length > 0)

const DESCRIPTION_ERROR_ID = 'guided-description-error'

const descriptionAriaDescribedBy = computed(() =>
  descriptionFieldInvalid.value ? DESCRIPTION_ERROR_ID : undefined,
)

function onDescribeAttachChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files?.length) return
  const maxBytes = 100 * 1024 * 1024
  const added = Array.from(input.files).filter((f) => f.size <= maxBytes)
  form.attachments = [...form.attachments, ...added]
  input.value = ''
}

function validateCurrent(): boolean {
  clearErrors()
  const s = step.value
  if (s === 0) {
    if (!form.title || form.title.trim().length < 3) {
      errors.title = 'Enter a title of at least 3 characters.'
      return false
    }
  }
  if (s === 1) {
    if (form.skills.length < 1) {
      errors.skills = 'Add at least one skill.'
      return false
    }
  }
  if (s === 2) {
    if (!form.scopeEstimate) {
      errors.scopeEstimate = 'Select a project size to continue.'
      return false
    }
    if (!form.scopeDurationKey) {
      errors.scopeDuration = 'Select how long the work will take.'
      return false
    }
    if (!form.experienceLevel) {
      errors.experienceLevel = 'Select an experience level.'
      return false
    }
    if (!form.contractToHire) {
      errors.contractToHire = 'Select whether this job could become full time.'
      return false
    }
  }
  if (s === 3) {
    if (!form.budgetType) {
      errors.budgetType = 'Choose a budget type.'
      return false
    }
    const min = Number(form.budgetMin || 0)
    const max = Number(form.budgetMax || 0)
    if (form.budgetType === 'hourly') {
      if (min <= 0) {
        errors.budgetMin = 'Enter a minimum hourly rate greater than 0.'
        return false
      }
      if (max <= min) {
        errors.budgetMax = 'Maximum must be greater than minimum.'
        return false
      }
    } else {
      if (min <= 0 && max <= 0) {
        errors.budgetMin = 'Enter a budget amount greater than 0.'
        return false
      }
      if (max > 0 && max < min) {
        errors.budgetMax = 'Maximum must be at least the minimum.'
        return false
      }
    }
  }
  if (s === 4) {
    const tlen = (form.description ?? '').trim().length
    if (tlen === 0) {
      errors.description = 'Description is required'
      return false
    }
    if (tlen < DESCRIBE_MIN_CHARS) {
      errors.description = 'Must be more than 50 characters'
      return false
    }
    if (form.description.length > DESCRIBE_MAX_CHARS) {
      errors.description = `Description must be at most ${DESCRIBE_MAX_CHARS.toLocaleString()} characters.`
      return false
    }
  }
  return true
}

const canGoNext = computed(() => {
  if (step.value === 0) return (form.title?.trim().length ?? 0) >= 3
  if (step.value === 1) return form.skills.length >= 1
  if (step.value === 2) {
    return (
      !!form.scopeEstimate &&
      !!form.scopeDurationKey &&
      !!form.experienceLevel &&
      !!form.contractToHire
    )
  }
  if (step.value === 3) {
    const min = Number(form.budgetMin || 0)
    const max = Number(form.budgetMax || 0)
    if (!form.budgetType) return false
    if (form.budgetType === 'hourly') return min > 0 && max > min
    return (min > 0 || max > 0) && (max === 0 || max >= min)
  }
  if (step.value === 4) {
    const tlen = (form.description ?? '').trim().length
    const len = form.description.length
    return tlen >= DESCRIBE_MIN_CHARS && len <= DESCRIBE_MAX_CHARS
  }
  return true
})

function goNext() {
  if (!validateCurrent()) return
  if (step.value === 2 && form.scopeEstimate && form.scopeDurationKey) {
    form.projectLength = mapScopeDurationToProjectLength(
      form.scopeEstimate,
      form.scopeDurationKey as ScopeDurationKey,
    )
  }
  step.value++
}

function goBack() {
  if (step.value === 0) {
    void router.push({ name: 'client-job-post-instant-welcome' })
    return
  }
  step.value--
}

function onSkillSearchFocus() {
  if (skillSearchBlurTimer !== undefined) {
    clearTimeout(skillSearchBlurTimer)
    skillSearchBlurTimer = undefined
  }
  skillSearchFocused.value = true
}

function onSkillSearchBlur() {
  skillSearchBlurTimer = setTimeout(() => {
    skillSearchFocused.value = false
    skillSearchBlurTimer = undefined
  }, 200)
}

function onSkillSearchEscape() {
  skillSearchFocused.value = false
  skillSearchQuery.value = ''
}

function clearSkillSearch() {
  skillSearchQuery.value = ''
  void document.getElementById('guided-skill-search')?.focus()
}

function selectSkillFromDropdown(skill: string) {
  addPopularSkill(skill)
  skillSearchQuery.value = ''
  void document.getElementById('guided-skill-search')?.focus()
}

function addSkillFromSearch() {
  const t = skillSearchQuery.value.trim()
  if (t.length < 1) return
  const sug = skillDropdownSuggestions.value
  const exact = sug.find((s) => s.toLowerCase() === t.toLowerCase())
  if (exact) {
    addPopularSkill(exact)
  } else if (sug.length > 0) {
    addPopularSkill(sug[0])
  } else if (!form.skills.includes(t)) {
    form.skills.push(t)
  }
  skillSearchQuery.value = ''
}

function addPopularSkill(skill: string) {
  if (form.skills.includes(skill)) return
  form.skills.push(skill)
}

function addQuestion() {
  form.questions.push({ question: '', required: false })
}

function goToGuidedStep(target: number) {
  postReviewInfoModalOpen.value = false
  step.value = target
  if (target === 2) syncScopeStepPhaseFromForm()
}

async function saveAsDraft() {
  form.visibility = 'private'
  await publishJob()
}

async function onPostReviewModalConfirm() {
  postReviewInfoModalOpen.value = false
  await publishJob()
}

function instantReviewUid(jobId: string): string {
  if (/^\d+$/.test(jobId)) return jobId
  return (BigInt(Date.now()) * 1000000n + BigInt(Math.floor(Math.random() * 1_000_000))).toString()
}

async function publishJob(options?: { afterCreate?: 'verification' | 'jobs' }) {
  clearErrors()
  if (!form.category) {
    errors.category = 'Select a category.'
    return
  }
  const afterCreate = options?.afterCreate ?? 'verification'
  publishing.value = true
  const job = await jobStore.createJob(
    {
      title: form.title,
      description: form.description,
      category: form.category,
      type: form.budgetType,
      experienceLevel: form.experienceLevel as 'entry' | 'intermediate' | 'expert',
      projectLength: form.projectLength as 'short' | 'medium' | 'long',
      budget: {
        type: form.budgetType,
        min: form.budgetMin,
        max: form.budgetMax,
        currency: 'USD',
      },
      skills: form.skills,
      visibility: form.visibility,
      location: form.isRemote ? 'Remote' : undefined,
      screeningQuestions: form.questions
        .filter((q) => q.question.trim())
        .map((q, i) => ({ id: `sq-${i}`, question: q.question.trim(), required: q.required })),
    },
    { successToast: false },
  )
  publishing.value = false
  if (!job) return
  if (afterCreate === 'jobs') {
    toast.success('Draft saved', 'Your job was saved as a draft.')
    void router.push('/client/jobs')
    return
  }
  const uid = instantReviewUid(job.id)
  void router.push({ name: 'client-job-post-instant-review', query: { uid } })
}
</script>

<style scoped>
.post-review-modal-enter-active,
.post-review-modal-leave-active {
  transition: opacity 0.2s ease;
}
.post-review-modal-enter-active .relative,
.post-review-modal-leave-active .relative {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.post-review-modal-enter-from,
.post-review-modal-leave-to {
  opacity: 0;
}
.post-review-modal-enter-from .relative,
.post-review-modal-leave-to .relative {
  opacity: 0;
  transform: scale(0.96) translateY(6px);
}
</style>
