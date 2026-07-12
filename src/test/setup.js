import '@testing-library/jest-dom'

// storage shim (vitest/jsdom combos vary)
function memStorage() {
  let s = {}
  return {
    getItem: k => (k in s ? s[k] : null),
    setItem: (k, v) => { s[k] = String(v) },
    removeItem: k => { delete s[k] },
    clear: () => { s = {} },
  }
}
Object.defineProperty(window, 'localStorage', { value: memStorage() })
Object.defineProperty(window, 'sessionStorage', { value: memStorage() })

// framer-motion + jsdom shims
window.matchMedia = window.matchMedia || function () {
  return { matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }
}
window.IntersectionObserver = window.IntersectionObserver || class {
  observe() {} unobserve() {} disconnect() {}
}
window.scrollTo = window.scrollTo || function () {}
