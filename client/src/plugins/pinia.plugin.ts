import type { App } from 'vue'
import { createPinia } from 'pinia'

// ============================================================
// PINIA PLUGIN SETUP
// ============================================================

const pinia = createPinia()

// To add persistence, install piniaPluginPersistedstate and call:
//   pinia.use(piniaPluginPersistedstate)

export function installPinia(app: App): void {
  app.use(pinia)
}

export { pinia }
