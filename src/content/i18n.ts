/**
 * i18n - Internationalization loader for extension messages
 */

import enMessages from '../../public/locales/en/messages.json';

// Message catalogs by locale
const catalogs: Record<string, Record<string, string>> = {
  en: enMessages,
};

const FALLBACK_LOCALE = 'en';

// Current locale (default to 'en' for now)
let currentLocale = 'en';

// Get a message by key with optional parameter substitution
export function getMessage(key: string, params?: Record<string, string>): string {
  const catalog = catalogs[currentLocale] || catalogs[FALLBACK_LOCALE];
  const fallbackCatalog = catalogs[FALLBACK_LOCALE];
  let message = catalog[key] || fallbackCatalog[key] || key;
  
  // Replace parameters like {channel}
  if (params) {
    for (const [paramKey, paramValue] of Object.entries(params)) {
      message = message.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), paramValue);
    }
  }
  
  return message;
}

// Get all messages for a locale
export function getMessages(locale?: string): Record<string, string> {
  return catalogs[locale || currentLocale] || catalogs['en'];
}

// Get current locale
export function getCurrentLocale(): string {
  return currentLocale;
}

// Set locale
export function setLocale(locale: string): void {
  if (catalogs[locale]) {
    currentLocale = locale;
  }
}

// Get available locales
export function getAvailableLocales(): string[] {
  return Object.keys(catalogs);
}