import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppInput from '../AppInput.vue'

describe('AppInput', () => {
  it('renders input element', () => {
    const wrapper = mount(AppInput)
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('renders with label when provided', () => {
    const wrapper = mount(AppInput, {
      props: { label: 'Email Address' },
    })
    expect(wrapper.text()).toContain('Email Address')
  })

  it('binds v-model correctly', async () => {
    let currentValue: string | number = 'initial'
    const wrapper = mount(AppInput, {
      props: {
        modelValue: currentValue,
        'onUpdate:modelValue': (value: string | number) => {
          currentValue = value
          wrapper.setProps({ modelValue: value })
        },
      },
    })

    const input = wrapper.find('input')
    expect(input.element.value).toBe('initial')

    await input.setValue('updated')
    expect(wrapper.props('modelValue')).toBe('updated')
  })

  it('shows error message when provided', () => {
    const wrapper = mount(AppInput, {
      props: { error: 'This field is required' },
    })
    expect(wrapper.text()).toContain('This field is required')
  })

  it('shows hint text when provided', () => {
    const wrapper = mount(AppInput, {
      props: { hint: 'Enter your email' },
    })
    expect(wrapper.text()).toContain('Enter your email')
  })

  it('applies disabled state', () => {
    const wrapper = mount(AppInput, {
      props: { disabled: true },
    })
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  it('applies readonly state', () => {
    const wrapper = mount(AppInput, {
      props: { readonly: true },
    })
    expect(wrapper.find('input').attributes('readonly')).toBeDefined()
  })

  it('renders correct input type', () => {
    const wrapper = mount(AppInput, {
      props: { type: 'email' },
    })
    expect(wrapper.find('input').attributes('type')).toBe('email')
  })

  it('renders placeholder', () => {
    const wrapper = mount(AppInput, {
      props: { placeholder: 'Enter text...' },
    })
    expect(wrapper.find('input').attributes('placeholder')).toBe('Enter text...')
  })

  it('renders required indicator when required', () => {
    const wrapper = mount(AppInput, {
      props: { label: 'Email', required: true },
    })
    expect(wrapper.text()).toContain('*')
  })
})
