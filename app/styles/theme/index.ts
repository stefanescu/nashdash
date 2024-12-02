export * from './colors'
export * from './components'
export * from './hooks'
export * from './base'

// Helper function to get theme-aware class names
export function getThemeClass(
  baseClass: string,
  isNightMode?: boolean,
  nightModeClass?: string
) {
  if (!isNightMode || !nightModeClass) return baseClass
  return `${baseClass} ${nightModeClass}`
}
