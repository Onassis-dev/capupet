import { SelectContent, SelectItem } from "@workspace/ui/components/ui/select";
import { useI18n } from "@/hooks/use-i18n";
import {
  CatIcon,
  CircleDashedIcon,
  FileQuestionIcon,
  DogIcon,
  MarsIcon,
  VenusIcon,
  MailIcon,
  SyringeIcon,
  Slice,
} from "lucide-react";
import { WhatsAppIcon } from "@workspace/ui/components/icons";

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
        <FileQuestionIcon />
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

export const ColorOptions = () => {
  const t = useI18n({
    black: {
      es: "Negro",
      en: "Black",
    },
    red: {
      es: "Rojo",
      en: "Red",
    },
    blue: {
      es: "Azul",
      en: "Blue",
    },
    green: {
      es: "Verde",
      en: "Green",
    },
    yellow: {
      es: "Amarillo",
      en: "Yellow",
    },
    purple: {
      es: "Morado",
      en: "Purple",
    },
    orange: {
      es: "Naranja",
      en: "Orange",
    },
    pink: {
      es: "Rosa",
      en: "Pink",
    },
  });

  return (
    <SelectContent>
      <SelectItem value="black">
        <div className="bg-neutral-700 size-3 rounded-full" />
        {t("black")}
      </SelectItem>
      <SelectItem value="red">
        <div className="bg-red-400 size-3 rounded-full" />
        {t("red")}
      </SelectItem>
      <SelectItem value="blue">
        <div className="bg-blue-400 size-3 rounded-full" />
        {t("blue")}
      </SelectItem>
      <SelectItem value="green">
        <div className="bg-emerald-400 size-3 rounded-full" />
        {t("green")}
      </SelectItem>
      <SelectItem value="yellow">
        <div className="bg-yellow-400 size-3 rounded-full" />
        {t("yellow")}
      </SelectItem>
      <SelectItem value="purple">
        <div className="bg-purple-400 size-3 rounded-full" />
        {t("purple")}
      </SelectItem>
      <SelectItem value="orange">
        <div className="bg-orange-400 size-3 rounded-full" />
        {t("orange")}
      </SelectItem>
      <SelectItem value="pink">
        <div className="bg-pink-400 size-3 rounded-full" />
        {t("pink")}
      </SelectItem>
    </SelectContent>
  );
};

export const StyleOptions = () => {
  const t = useI18n({
    modern: {
      es: "Moderno",
      en: "Modern",
    },
    minimalist: {
      es: "Minimalista",
      en: "Minimalist",
    },
    friendly: {
      es: "Amigable",
      en: "Friendly",
    },
  });

  return (
    <SelectContent>
      <SelectItem value="modern">{t("modern")}</SelectItem>
      <SelectItem value="minimalist">{t("minimalist")}</SelectItem>
      <SelectItem value="friendly">{t("friendly")}</SelectItem>
    </SelectContent>
  );
};

export const ContactOptionOptions = () => {
  const t = useI18n({
    email: {
      es: "Email",
      en: "Email",
    },
  });

  return (
    <SelectContent>
      <SelectItem value="whatsapp">
        <WhatsAppIcon /> WhatsApp
      </SelectItem>
      <SelectItem value="email">
        <MailIcon />
        {t("email")}
      </SelectItem>
    </SelectContent>
  );
};

export const MedicalOptionTypeOptions = () => {
  const t = useI18n({
    vaccine: {
      es: "Vacuna",
      en: "Vaccine",
    },
    procedure: {
      es: "Procedimiento",
      en: "Procedure",
    },
  });

  return (
    <SelectContent>
      <SelectItem value="vaccine">
        <SyringeIcon />
        {t("vaccine")}
      </SelectItem>
      <SelectItem value="procedure">
        <Slice />
        {t("procedure")}
      </SelectItem>
    </SelectContent>
  );
};
