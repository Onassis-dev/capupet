import {
  listedInformationStyle,
  iconColor,
  buttonStyle,
  buttonColor,
} from "./styles";
import { ugcI18n } from "./ugc-i18n";
import { Website } from "./types";
import { Calendar, MailIcon, Mars, Ruler, Scale } from "lucide-react";
import { HeaderUGC } from "./HeaderUGC";
import { FooterUGC } from "./FooterUGC";
import { WhatsAppIcon } from "../icons";

interface Props {
  website: Website;
  pet: Pet;
  slug: string;
}

interface Pet {
  id: string;
  name: string;
  image: string | null;
  images?: string[];
  description: string | null;
  species: string;
  sex: string;
  bornDate: string;
  weight: number;
  size: string;
  measurement: string;
}

export const PetUGC = ({ website, pet, slug }: Props) => {
  const t = ugcI18n(website.lang);

  const calculateAge = (bornDate: string | null): string => {
    if (!bornDate) return "-";

    const birthDate = new Date(bornDate);
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }

    if (years < 0) return "-";

    const yearLabel = years === 1 ? t("year") : t("years");
    const monthLabel = months === 1 ? t("month") : t("months");

    if (years === 0) {
      return `${months} ${monthLabel}`;
    } else {
      return `${years} ${yearLabel}`;
    }
  };

  return (
    <>
      <HeaderUGC website={website} slug={slug} />

      <main className="w-full max-w-xl mx-auto px-4 py-16">
        <section className="flex items-center gap-4 pb-5 flex-col">
          <img
            src={pet?.image || "no Image"}
            alt={pet.name}
            className="size-40 aspect-square object-cover rounded-full "
          />
          <h1 className="text-3xl font-bold">{pet.name}</h1>
        </section>

        {/* Listed information */}
        <section className="grid grid-cols-2 gap-3 pt-5">
          <div className={listedInformationStyle(website.style)}>
            <Calendar className={iconColor(website.color)} />
            <div className="flex flex-col">
              <span className="text-sm text-neutral-500 font-medium">
                {t("age")}
              </span>
              <span>{calculateAge(pet.bornDate)}</span>
            </div>
          </div>
          <div className={listedInformationStyle(website.style)}>
            <Scale className={iconColor(website.color)} />
            <div className="flex flex-col">
              <span className="text-sm text-neutral-500 font-medium">
                {t("weight")}
              </span>
              <span>
                {pet.weight || "-"} {pet.measurement}
              </span>
            </div>
          </div>
          <div className={listedInformationStyle(website.style)}>
            <Mars className={iconColor(website.color)} />
            <div className="flex flex-col">
              <span className="text-sm text-neutral-500 font-medium">
                {t("sex")}
              </span>
              <span>{t(pet.sex as any)}</span>
            </div>
          </div>
          <div className={listedInformationStyle(website.style)}>
            <Ruler className={iconColor(website.color)} />
            <div className="flex flex-col">
              <span className="text-sm text-neutral-500 font-medium">
                {t("size")}
              </span>
              <span>{pet.size ? t(pet.size as any) : "-"}</span>
            </div>
          </div>
        </section>

        {/* Description */}
        <section className="mt-10 ">
          <h2 className="text-xl font-bold">
            {t("about")} {pet.name}
          </h2>
          <p className="mt-2">{pet.description}</p>
        </section>

        {/* Gallery */}
        {pet.images && pet.images.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold mb-4">{t("gallery")}</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {pet.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Imagen ${index + 1}`}
                  className="w-full aspect-square object-cover rounded-xl"
                />
              ))}
            </div>
          </section>
        )}

        {website.contactOption === "whatsapp" && (
          <a
            href={`https://wa.me/${website.countryCode}${website.phone}?text=${encodeURIComponent(t("getInfo") + " " + pet.name)}`}
            className={`${buttonStyle(website.style)} ${buttonColor(website.color)} w-full flex items-center gap-2 justify-center mt-10 sticky bottom-10 py-2`}
          >
            <WhatsAppIcon className="size-4" /> {t("askAbout")} {pet.name}
          </a>
        )}

        {website.contactOption === "email" && (
          <a
            href={`mailto:${website.email}?subject=${encodeURIComponent(t("getInfo") + " " + pet.name)}`}
            className={`${buttonStyle(website.style)} ${buttonColor(website.color)} w-full flex items-center gap-2 justify-center mt-10 sticky bottom-10 py-2`}
          >
            <MailIcon className="size-4" /> {t("askAbout")} {pet.name}
          </a>
        )}
      </main>

      <FooterUGC website={website} slug={slug} />
    </>
  );
};
