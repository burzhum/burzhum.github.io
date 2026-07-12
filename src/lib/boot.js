export const BOOT_KEY = 'booted'

export const BOOT_LINES = [
  'ASRUL-BIOS v18.7 — POST',
  'CPU ....................... human, caffeinated',
  'MEM ....................... 18+ years, ECC',
  'SLA target ................ 99.90% [LOCKED]',
  'mounting /career .......... ok',
  'mounting /projects ........ 12 apps found',
  'starting ai-agents.service  [ACTIVE]',
  'boot: OK — welcome.',
]

export const shouldBoot = (storage) => storage.getItem(BOOT_KEY) !== '1'
export const markBooted = (storage) => storage.setItem(BOOT_KEY, '1')
