import { describe, it, expect, vi, beforeEach } from 'vitest'
import { logger } from '../logger'

describe('logger', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('logs info messages', () => {
    const spy = vi.spyOn(console, 'info').mockImplementation(() => {})
    logger.info('test message')
    expect(spy).toHaveBeenCalledOnce()
    expect(spy.mock.calls[0][0]).toContain('INFO')
    expect(spy.mock.calls[0][0]).toContain('test message')
  })

  it('logs warn messages', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    logger.warn('warning message')
    expect(spy).toHaveBeenCalledOnce()
    expect(spy.mock.calls[0][0]).toContain('WARN')
  })

  it('logs error messages', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    logger.error('error message')
    expect(spy).toHaveBeenCalledOnce()
    expect(spy.mock.calls[0][0]).toContain('ERROR')
  })

  it('logs caught errors with context', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    logger.catch(new Error('boom'), 'AuthStore')
    expect(spy).toHaveBeenCalledOnce()
    expect(spy.mock.calls[0][0]).toContain('[AuthStore]')
    expect(spy.mock.calls[0][0]).toContain('boom')
  })

  it('includes data payload in log output', () => {
    const spy = vi.spyOn(console, 'info').mockImplementation(() => {})
    logger.info('with data', { userId: '123' })
    expect(spy).toHaveBeenCalledWith(expect.any(String), { userId: '123' })
  })
})
