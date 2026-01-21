export const serverI18n = <K extends string>(
  language: "es" | "en",
  texts: Record<K, Record<"es" | "en", string>>
) => {
  const t = (key: K) => {
    return texts[key]?.[language];
  };

  return t;
};
