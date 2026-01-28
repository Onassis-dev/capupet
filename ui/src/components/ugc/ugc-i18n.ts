import { Lang } from "./types";

const texts = {
  all: {
    es: "Todos",
    en: "All",
  },
  dog: {
    es: "Perros",
    en: "Dogs",
  },
  cat: {
    es: "Gatos",
    en: "Cats",
  },
  other: {
    es: "Otros",
    en: "Others",
  },
  noImage: {
    es: "Sin imagen",
    en: "No image",
  },
  male: {
    es: "Macho",
    en: "Male",
  },
  female: {
    es: "Hembra",
    en: "Female",
  },
  loading: {
    es: "Cargando...",
    en: "Loading...",
  },
  noPetsFound: {
    es: "No se encontraron mascotas",
    en: "No pets found",
  },
  small: {
    es: "Pequeño",
    en: "Small",
  },
  medium: {
    es: "Mediano",
    en: "Medium",
  },
  large: {
    es: "Grande",
    en: "Large",
  },
  extraLarge: {
    es: "Extra grande",
    en: "Extra large",
  },
  year: {
    es: "año",
    en: "year",
  },
  years: {
    es: "años",
    en: "years",
  },
  month: {
    es: "mes",
    en: "month",
  },
  months: {
    es: "meses",
    en: "months",
  },
  age: {
    es: "Edad",
    en: "Age",
  },
  weight: {
    es: "Peso",
    en: "Weight",
  },
  sex: {
    es: "Sexo",
    en: "Sex",
  },
  size: {
    es: "Tamaño",
    en: "Size",
  },
  description: {
    es: "Descripción",
    en: "Description",
  },
  gallery: {
    es: "Galería",
    en: "Gallery",
  },
  about: {
    es: "Acerca de",
    en: "About",
  },
  and: {
    es: "y",
    en: "and",
  },
  back: {
    es: "Volver",
    en: "Back",
  },
  askAbout: {
    es: "Preguntar sobre",
    en: "Ask about",
  },
  getInfo: {
    es: "Me gustaria saber mas sobre",
    en: "I would like to know more about",
  },
} as const satisfies Record<string, Record<Lang, string>>;

export const ugcI18n = (language: Lang) => {
  return (key: keyof typeof texts) => texts[key]?.[language];
};
