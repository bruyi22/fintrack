/* eslint-disable react-refresh/only-export-components -- hooks live next to provider */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { STRINGS } from "../i18n/strings";

const STORAGE_KEY = "fintrack-locale";
const DEFAULT_LOCALE = "en";
const SUPPORTED = ["en", "es"];

const LocaleContext = createContext(null);

function getInitialLocale() {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (SUPPORTED.includes(stored)) return stored;
  } catch {
    /* ignore */
  }
  const nav = navigator.language?.slice(0, 2);
  if (nav === "es") return "es";
  return DEFAULT_LOCALE;
}

/**
 * @param {string} key
 * @param {Record<string, string | number>} [vars]
 */
function translate(locale, key, vars) {
  const map = STRINGS[locale] || STRINGS.en;
  let str = map[key] ?? STRINGS.en[key] ?? key;
  if (vars) {
    Object.entries(vars).forEach(([k, v]) => {
      str = str.replaceAll(`{{${k}}}`, String(v));
    });
  }
  return str;
}

export function LocaleProvider({ children }) {
  const [locale, setLocaleState] = useState(getInitialLocale);

  useEffect(() => {
    document.documentElement.lang = locale === "es" ? "es" : "en";
  }, [locale]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      /* ignore */
    }
  }, [locale]);

  const setLocale = useCallback((l) => {
    if (SUPPORTED.includes(l)) setLocaleState(l);
  }, []);

  const value = useMemo(() => {
    const numberLocale = locale === "es" ? "es-MX" : "en-US";

    const t = (key, vars) => translate(locale, key, vars);

    /** @param {number} n @param {Intl.NumberFormatOptions} [opts] */
    const formatMoney = (n, opts = {}) =>
      new Intl.NumberFormat(numberLocale, {
        style: "currency",
        currency: "USD",
        ...opts,
      }).format(n);

    return { locale, setLocale, t, numberLocale, formatMoney };
  }, [locale, setLocale]);

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
