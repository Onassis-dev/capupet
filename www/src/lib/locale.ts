export const redirectToLocale = (Astro: any) => {
  let locale = Astro.request.headers.get("accept-language")?.substring(0, 2);
  if (!["es", "en"].includes(locale)) locale = "en";

  return `${Astro.url.origin}/${locale}${Astro.url.pathname}`;
};

export const isLocaleValid = (Astro: any) => {
  return ["es", "en"].includes(Astro.params.locale?.split("/")[0]);
};

export const getLocale = (Astro: any) => {
  let locale = Astro.request.headers.get("accept-language")?.substring(0, 2);
  if (!["es", "en"].includes(locale)) locale = "en";
  return locale;
};
