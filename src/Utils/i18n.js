import en from "../Locales/en.json" with { type: "json" };
import ar from "../Locales/ar.json" with { type: "json" };

const locales = { en, ar };

export const SUPPORTED_LANGUAGES = Object.keys(locales);

/**
 * Get translated message for a given key and language
 * @param {string} key - Message key (e.g. "USER_CREATED_SUCCESS")
 * @param {string} lang - Language code ("en" | "ar")
 * @param {object} params - Dynamic parameters to replace in the string
 * @returns {string} - Translated and formatted message
 */
export const getMessage = (key, lang = "en", params = {}) => {
  const language = locales[lang] || locales.en;

  // Get raw message, fall back to English, then to the raw key if missing everywhere.
  let message = language[key] || locales.en[key] || key;

  // Replace parameters like {{name}}
  if (params && typeof params === "object") {
    Object.keys(params).forEach((param) => {
      message = message.replace(new RegExp(`{{${param}}}`, "g"), params[param]);
    });
  }

  return message;
};

/**
 * Text direction for a given language.
 * @param {string} lang - Language code ("en" | "ar")
 * @returns {string} "rtl" | "ltr"
 */
export const getDir = (lang = "en") => (lang === "ar" ? "rtl" : "ltr");
