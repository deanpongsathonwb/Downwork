import { defineStore } from 'pinia'
import { ref } from 'vue'

export type SignupFlowRole = 'client' | 'freelancer'

// Shared signup funnel step for RegisterPage + AuthLayout header (no URL query).
export const useSignupFlowStore = defineStore('signupFlow', () => {
  const step = ref<1 | 2>(1)
  const role = ref<SignupFlowRole | null>(null)

  function setFormStep(s: 1 | 2, r: SignupFlowRole | null): void {
    step.value = s
    role.value = r
  }

  function switchSignupRole(r: SignupFlowRole): void {
    step.value = 2
    role.value = r
  }

  function reset(): void {
    step.value = 1
    role.value = null
  }

  return { step, role, setFormStep, switchSignupRole, reset }
})
