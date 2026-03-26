import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useToastStore } from '../toast.store'

describe('toast.store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  it('starts with no toasts', () => {
    const store = useToastStore()
    expect(store.toasts).toEqual([])
  })

  it('adds a success toast', () => {
    const store = useToastStore()
    store.success('Done', 'All good')
    expect(store.toasts).toHaveLength(1)
    expect(store.toasts[0].type).toBe('success')
    expect(store.toasts[0].title).toBe('Done')
    expect(store.toasts[0].message).toBe('All good')
  })

  it('adds an error toast with extended duration', () => {
    const store = useToastStore()
    store.error('Oops', 'Something broke')
    expect(store.toasts[0].type).toBe('error')
    expect(store.toasts[0].duration).toBe(6000)
  })

  it('adds warning and info toasts', () => {
    const store = useToastStore()
    store.warning('Watch out')
    store.info('FYI')
    expect(store.toasts).toHaveLength(2)
    expect(store.toasts[0].type).toBe('warning')
    expect(store.toasts[1].type).toBe('info')
  })

  it('auto-removes toast after its duration', () => {
    const store = useToastStore()
    store.success('Temp')
    expect(store.toasts).toHaveLength(1)
    vi.advanceTimersByTime(5000)
    expect(store.toasts).toHaveLength(0)
  })

  it('respects max toasts limit', () => {
    const store = useToastStore()
    for (let i = 0; i < 7; i++) {
      store.info(`Toast ${i}`)
    }
    expect(store.toasts.length).toBeLessThanOrEqual(5)
  })

  it('removes a toast by id', () => {
    const store = useToastStore()
    const id = store.success('Remove me')
    expect(store.toasts).toHaveLength(1)
    store.remove(id)
    expect(store.toasts).toHaveLength(0)
  })

  it('clears all toasts', () => {
    const store = useToastStore()
    store.success('A')
    store.error('B')
    store.info('C')
    expect(store.toasts).toHaveLength(3)
    store.clear()
    expect(store.toasts).toHaveLength(0)
  })
})
