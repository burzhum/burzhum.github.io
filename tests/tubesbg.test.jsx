import { render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import TubesBg from '../src/components/TubesBg'

// The WebGL engine is ~190KB gzip and needs a real GL context — stub it.
const dispose = vi.fn()
const setColors = vi.fn()
const setLightsColors = vi.fn()
const factory = vi.fn(() => ({ tubes: { setColors, setLightsColors }, dispose }))
vi.mock('threejs-components/build/cursors/tubes1.min.js', () => ({ default: (...a) => factory(...a) }))

// matchMedia decides whether the layer runs at all: fine pointer + motion allowed.
function media({ fine = true, reduced = false } = {}) {
  window.matchMedia = q => ({
    matches: q.includes('pointer: fine') ? fine : q.includes('reduced-motion') ? reduced : false,
    addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {},
  })
}

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true })
  factory.mockClear(); dispose.mockClear()
  window.innerWidth = 1440
})
afterEach(() => vi.useRealTimers())

test('mounts a decorative, pointer-transparent canvas on a fine pointer', async () => {
  media()
  render(<TubesBg />)
  const canvas = screen.getByTestId('tubes-bg')
  expect(canvas.tagName).toBe('CANVAS')
  expect(canvas).toHaveAttribute('aria-hidden', 'true')
  expect(canvas.className).toMatch(/pointer-events-none/)
})

test('defers the engine import past the load window, then boots it once', async () => {
  media()
  render(<TubesBg />)
  expect(factory).not.toHaveBeenCalled() // nothing pulled during first paint
  await vi.advanceTimersByTimeAsync(2000)
  await waitFor(() => expect(factory).toHaveBeenCalledTimes(1))
  const [el, opts] = factory.mock.calls[0]
  expect(el.tagName).toBe('CANVAS')
  expect(opts.tubes.colors).toHaveLength(3)
  expect(opts.tubes.lights.colors).toHaveLength(4)
})

test('renders nothing on touch devices', () => {
  media({ fine: false })
  render(<TubesBg />)
  expect(screen.queryByTestId('tubes-bg')).toBeNull()
})

test('renders nothing on narrow viewports', () => {
  media()
  window.innerWidth = 500
  render(<TubesBg />)
  expect(screen.queryByTestId('tubes-bg')).toBeNull()
})

test('renders nothing when the user asked for reduced motion', () => {
  media({ reduced: true })
  render(<TubesBg />)
  expect(screen.queryByTestId('tubes-bg')).toBeNull()
})

test('disposes the GL context on unmount', async () => {
  media()
  const { unmount } = render(<TubesBg />)
  await vi.advanceTimersByTimeAsync(2000)
  await waitFor(() => expect(factory).toHaveBeenCalled())
  unmount()
  expect(dispose).toHaveBeenCalled()
})
