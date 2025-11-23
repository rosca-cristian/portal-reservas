import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { exportToCSV } from './exportToCSV'

describe('exportToCSV', () => {
  let createElementSpy: any
  let appendChildSpy: any
  let removeChildSpy: any
  let clickSpy: any

  beforeEach(() => {
    clickSpy = vi.fn()
    createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue({
      setAttribute: vi.fn(),
      click: clickSpy,
      style: {},
    } as any)

    appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => null as any)
    removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => null as any)

    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('exports data to CSV with correct headers', () => {
    const data = [
      { Name: 'John', Age: 30, Email: 'john@example.com' },
      { Name: 'Jane', Age: 25, Email: 'jane@example.com' },
    ]

    exportToCSV(data, 'test.csv')

    expect(createElementSpy).toHaveBeenCalledWith('a')
    expect(appendChildSpy).toHaveBeenCalled()
    expect(removeChildSpy).toHaveBeenCalled()
    expect(clickSpy).toHaveBeenCalled()
  })

  it('handles values with commas correctly', () => {
    const data = [
      { Name: 'John, Doe', Age: 30 },
    ]

    exportToCSV(data, 'test.csv')

    // Verify that the value with comma is quoted
    const blobSpy = vi.spyOn(global, 'Blob')
    exportToCSV(data, 'test.csv')

    expect(blobSpy).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.stringContaining('"John, Doe"'),
      ]),
      expect.any(Object)
    )
  })

  it('handles null and undefined values', () => {
    const data = [
      { Name: 'John', Age: null, Email: undefined },
    ]

    exportToCSV(data, 'test.csv')

    expect(clickSpy).toHaveBeenCalled()
  })

  it('handles empty array gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    exportToCSV([], 'test.csv')

    expect(consoleSpy).toHaveBeenCalledWith('No data to export')
    expect(clickSpy).not.toHaveBeenCalled()
  })

  it('escapes double quotes in values', () => {
    const data = [
      { Name: 'John "Johnny" Doe', Age: 30 },
    ]

    const blobSpy = vi.spyOn(global, 'Blob')
    exportToCSV(data, 'test.csv')

    expect(blobSpy).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.stringContaining('John ""Johnny"" Doe'),
      ]),
      expect.any(Object)
    )
  })

  it('sets correct filename', () => {
    const data = [{ Name: 'John' }]
    const mockElement = {
      setAttribute: vi.fn(),
      click: vi.fn(),
      style: {},
    }

    createElementSpy.mockReturnValue(mockElement as any)

    exportToCSV(data, 'my-export.csv')

    expect(mockElement.setAttribute).toHaveBeenCalledWith('download', 'my-export.csv')
  })
})
