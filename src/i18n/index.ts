import es, { type Translations } from './es'
import en from './en'

export type { Translations }
export type Locale = 'es' | 'en'

export const defaultLocale: Locale = 'es'
export const locales: Locale[] = ['es', 'en']

const dictionaries: Record<Locale, Translations> = { es, en }

/**
 * Server-side: get translations for a given locale.
 * Defaults to ES (primary language).
 *
 * Usage in Server Components:
 *   const t = getT('es')
 *   <h1>{t.landing.hero.headline_1}</h1>
 */
export function getT(locale: Locale = defaultLocale): Translations {
  return dictionaries[locale]
}

/**
 * Resolve a locale string from user profile or Accept-Language header.
 * Falls back to the default locale if the value is not supported.
 */
export function resolveLocale(value: string | null | undefined): Locale {
  if (value === 'en') return 'en'
  return defaultLocale
}
