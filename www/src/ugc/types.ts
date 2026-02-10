export type StylesTypes = "modern" | "minimalist" | "friendly";

export type Lang = "es" | "en";

export type Website = {
  title: string;
  description: string | null;
  image: string;
  lang: Lang;
  style: StylesTypes;
  color: string;
  city: string | null;
  instagram: string | null;
  facebook: string | null;
  youtube: string | null;
  email: string | null;
  website: string | null;
  phone: string | null;
  countryCode: string | null;
  contactOption: "whatsapp" | "email" | null;
};
