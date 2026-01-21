"use client";

import { create } from "zustand";
type Language = "es" | "en";

interface LanguageStore {
  language: Language;
  setLanguage: (language: Language) => void;
}

const getLanguage = (): Language => {
  if (typeof window === "undefined") return "en";
  const storedLanguage = localStorage.getItem("language");
  if (storedLanguage === "es" || storedLanguage === "en")
    return storedLanguage as Language;

  if (navigator.language.startsWith("en")) return "en";

  return "es";
};

export const useLanguage = create<LanguageStore>((set) => ({
  language: getLanguage(),
  setLanguage: (language: Language) => {
    set({ language });
    localStorage.setItem("language", language);
  },
}));

export const useI18n = <K extends string>(
  texts: Record<K, Record<Language, string>>
) => {
  const { language } = useLanguage();

  const t = (key: K) => {
    return texts[key]?.[language];
  };

  return t;
};
