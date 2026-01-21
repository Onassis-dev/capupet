import { SelectContent, SelectItem } from "./select";
import { useI18n } from "@/hooks/use-i18n";
import {
  CatIcon,
  CircleDashedIcon,
  CircleQuestionMarkIcon,
  DogIcon,
  MarsIcon,
  VenusIcon,
} from "lucide-react";

export const SpeciesOptions = () => {
  const t = useI18n({
    dog: {
      es: "Perro",
      en: "Dog",
    },
    cat: {
      es: "Gato",
      en: "Cat",
    },
    other: {
      es: "Otro",
      en: "Other",
    },
  });
  return (
    <SelectContent>
      <SelectItem value="dog">
        <DogIcon />
        {t("dog")}
      </SelectItem>
      <SelectItem value="cat">
        <CatIcon />
        {t("cat")}
      </SelectItem>
      <SelectItem value="other">
        <CircleDashedIcon />
        {t("other")}
      </SelectItem>
    </SelectContent>
  );
};

export const SexOptions = () => {
  const t = useI18n({
    male: {
      es: "Macho",
      en: "Male",
    },
    female: {
      es: "Hembra",
      en: "Female",
    },
    unknown: {
      es: "Desconocido",
      en: "Unknown",
    },
  });
  return (
    <SelectContent>
      <SelectItem value="male">
        <MarsIcon />
        {t("male")}
      </SelectItem>
      <SelectItem value="female">
        <VenusIcon />
        {t("female")}
      </SelectItem>
      <SelectItem value="unknown">
        <CircleQuestionMarkIcon />
        {t("unknown")}
      </SelectItem>
    </SelectContent>
  );
};

export const StatusOptions = () => {
  const t = useI18n({
    available: {
      es: "Disponible",
      en: "Available",
    },
    adopted: {
      es: "Adoptado",
      en: "Adopted",
    },
    deceased: {
      es: "Fallecido",
      en: "Deceased",
    },
    intake: {
      es: "En proceso",
      en: "Intake",
    },
  });
  return (
    <SelectContent>
      <SelectItem value="available">{t("available")}</SelectItem>
      <SelectItem value="adopted">{t("adopted")}</SelectItem>
      <SelectItem value="deceased">{t("deceased")}</SelectItem>
      <SelectItem value="intake">{t("intake")}</SelectItem>
    </SelectContent>
  );
};

export const SizeOptions = () => {
  const t = useI18n({
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
  });
  return (
    <SelectContent>
      <SelectItem value="small">{t("small")}</SelectItem>
      <SelectItem value="medium">{t("medium")}</SelectItem>
      <SelectItem value="large">{t("large")}</SelectItem>
      <SelectItem value="extraLarge">{t("extraLarge")}</SelectItem>
    </SelectContent>
  );
};

export const MeasurementOptions = () => {
  return (
    <SelectContent>
      <SelectItem value="Kgs">Kgs</SelectItem>
      <SelectItem value="Lbs">Lbs</SelectItem>
    </SelectContent>
  );
};

export const LanguageOptions = () => {
  const t = useI18n({
    es: {
      es: "Español",
      en: "Spanish",
    },
    en: {
      es: "Inglés",
      en: "English",
    },
  });
  return (
    <SelectContent>
      <SelectItem value="es">{t("es")}</SelectItem>
      <SelectItem value="en">{t("en")}</SelectItem>
    </SelectContent>
  );
};
