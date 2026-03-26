import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import ErrorBoundary from '../ErrorBoundary.vue'

vi.mock('@/utils/logger', () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
    catch: vi.fn(),
  },
}))

const ErrorThrowingComponent = defineComponent({
  name: 'ErrorThrowingComponent',
  props: {
    shouldError: { type: Boolean, default: false },
  },
  setup(props) {
    if (props.shouldError) {
      throw new Error('Test error')
    }
  },
  template: '<div>Normal content</div>',
})

describe('ErrorBoundary', () => {
  it('renders slot content when no error', () => {
    const wrapper = mount(ErrorBoundary, {
      slots: {
        default: '<div>Child content</div>',
      },
    })

    expect(wrapper.text()).toContain('Child content')
  })

  it('shows error UI with custom title', async () => {
    const wrapper = mount(ErrorBoundary, {
      props: {
        title: 'Custom Error Title',
      },
      slots: {
        default: h(ErrorThrowingComponent, { shouldError: true }),
      },
    })

    await flushPromises()

    expect(wrapper.text()).toContain('Custom Error Title')
  })

  it('shows error UI with custom message', async () => {
    const wrapper = mount(ErrorBoundary, {
      props: {
        message: 'Custom error message',
      },
      slots: {
        default: h(ErrorThrowingComponent, { shouldError: true }),
      },
    })

    await flushPromises()

    expect(wrapper.text()).toContain('Custom error message')
  })

  it('shows retry button by default', async () => {
    const wrapper = mount(ErrorBoundary, {
      slots: {
        default: h(ErrorThrowingComponent, { shouldError: true }),
      },
    })

    await flushPromises()

    expect(wrapper.find('button').exists()).toBe(true)
    expect(wrapper.text()).toContain('Try Again')
  })

  it('hides retry button when showRetry is false', async () => {
    const wrapper = mount(ErrorBoundary, {
      props: {
        showRetry: false,
      },
      slots: {
        default: h(ErrorThrowingComponent, { shouldError: true }),
      },
    })

    await flushPromises()

    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('emits retry event when retry button is clicked', async () => {
    const wrapper = mount(ErrorBoundary, {
      slots: {
        default: h(ErrorThrowingComponent, { shouldError: true }),
      },
    })

    await flushPromises()

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('retry')).toBeTruthy()
  })

  it('exposes reset method', async () => {
    const wrapper = mount(ErrorBoundary, {
      slots: {
        default: h(ErrorThrowingComponent, { shouldError: true }),
      },
    })

    await flushPromises()

    expect((wrapper.vm as any).hasError).toBe(true)

    ;(wrapper.vm as any).reset()

    expect((wrapper.vm as any).hasError).toBe(false)
  })
})
