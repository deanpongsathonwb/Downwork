import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppButton from '../AppButton.vue'

describe('AppButton', () => {
  it('renders slot content', () => {
    const wrapper = mount(AppButton, {
      slots: {
        default: 'Click Me',
      },
    })
    expect(wrapper.text()).toContain('Click Me')
  })

  it('renders as button by default', () => {
    const wrapper = mount(AppButton)
    expect(wrapper.element.tagName).toBe('BUTTON')
  })

  it('renders as anchor when href is provided', () => {
    const wrapper = mount(AppButton, {
      props: { href: 'https://example.com' },
    })
    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('href')).toBe('https://example.com')
  })

  it('applies primary variant classes by default', () => {
    const wrapper = mount(AppButton)
    expect(wrapper.classes()).toContain('bg-green-600')
  })

  it('applies danger variant classes', () => {
    const wrapper = mount(AppButton, {
      props: { variant: 'danger' },
    })
    expect(wrapper.classes()).toContain('bg-red-600')
  })

  it('applies size classes correctly', () => {
    const sizes = {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-sm',
      lg: 'text-base',
    } as const

    for (const [size, expectedClass] of Object.entries(sizes)) {
      const wrapper = mount(AppButton, {
        props: { size: size as 'xs' | 'sm' | 'md' | 'lg' },
      })
      expect(wrapper.classes()).toContain(expectedClass)
    }
  })

  it('shows loading spinner when loading is true', () => {
    const wrapper = mount(AppButton, {
      props: { loading: true },
    })
    expect(wrapper.find('svg.animate-spin').exists()).toBe(true)
  })

  it('is disabled when loading', () => {
    const wrapper = mount(AppButton, {
      props: { loading: true },
    })
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('is disabled when disabled prop is true', () => {
    const wrapper = mount(AppButton, {
      props: { disabled: true },
    })
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('emits click event when clicked', async () => {
    const wrapper = mount(AppButton)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('does not emit click when disabled', async () => {
    const wrapper = mount(AppButton, {
      props: { disabled: true },
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeFalsy()
  })

  it('has correct type attribute', () => {
    const wrapper = mount(AppButton, {
      props: { type: 'submit' },
    })
    expect(wrapper.attributes('type')).toBe('submit')
  })
})
