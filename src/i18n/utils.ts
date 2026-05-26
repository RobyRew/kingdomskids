import en from './en.json';
import es from './es.json';
import ca from './ca.json';
import ro from './ro.json';

export const LOCALES = ['en', 'es', 'ca', 'ro'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

const dictionaries: Record<Locale, typeof en> = { en, es, ca, ro };

type Dict = Record<string, unknown>;
function deepGet(obj: Dict, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object') return (acc as Dict)[key];
    return undefined;
  }, obj);
}

export function getDict(locale: Locale) {
  return dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE];
}

export function t(
  locale: Locale,
  key: string,
  vars: Record<string, string | number> = {},
): string {
  const dict = getDict(locale);
  let value = deepGet(dict as Dict, key);
  if (value === undefined && locale !== DEFAULT_LOCALE) {
    value = deepGet(dictionaries[DEFAULT_LOCALE] as Dict, key);
  }
  if (typeof value !== 'string') return key;
  return value.replace(/\{\{(\w+)\}\}/g, (_, name) =>
    name in vars ? String(vars[name]) : `{{${name}}}`,
  );
}

export function path(locale: Locale, ...segments: string[]): string {
  const clean = segments
    .flatMap((s) => s.split('/'))
    .filter(Boolean)
    .join('/');
  return `/${locale}${clean ? `/${clean}` : ''}`;
}

export function stripLocale(pathname: string): string {
  for (const loc of LOCALES) {
    const prefix = `/${loc}`;
    if (pathname === prefix) return '/';
    if (pathname.startsWith(`${prefix}/`)) return pathname.slice(prefix.length);
  }
  return pathname;
}

export function localeIntl(locale: Locale): string {
  return { en: 'en-GB', es: 'es-ES', ca: 'ca-ES', ro: 'ro-RO' }[locale];
}

export function alternateLinks(_currentLocale: Locale, currentPath: string): Array<{ locale: Locale; href: string }> {
  const stripped = stripLocale(currentPath);
  return LOCALES.map((loc) => ({
    locale: loc,
    href: `/${loc}${stripped === '/' ? '' : stripped}`,
  }));
}
