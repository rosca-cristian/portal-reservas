import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useDebounce } from './useDebounce'

describe('useDebounce', () => {
  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('test', 300))
    expect(result.current).toBe('test')
  })

  it('debounces value changes (AC#3)', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 300 } }
    )

    expect(result.current).toBe('initial')

    // Change value
    rerender({ value: 'updated', delay: 300 })

    // Should still be initial immediately
    expect(result.current).toBe('initial')

    // Wait for debounce
    await waitFor(() => {
      expect(result.current).toBe('updated')
    }, { timeout: 400 })
  })

  it('cancels previous timeout on rapid changes', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'first', delay: 300 } }
    )

    // Rapid changes
    rerender({ value: 'second', delay: 300 })
    rerender({ value: 'third', delay: 300 })
    rerender({ value: 'final', delay: 300 })

    // Should eventually settle on final value
    await waitFor(() => {
      expect(result.current).toBe('final')
    }, { timeout: 400 })
  })
})
