import { ugcI18n } from "./ugc-i18n";
import { Website } from "./types";
import {
  FacebookIcon,
  InstagramIcon,
  WhatsAppIcon,
  YouTubeIcon,
} from "@workspace/ui/components/icons";
import { GlobeIcon, MailIcon, PhoneIcon } from "lucide-react";

interface Props {
  website: Website;
  slug: string;
}

export const FooterUGC = ({ website, slug }: Props) => {
  const t = ugcI18n(website.lang);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t mt-auto bg-background">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex flex-col items-center gap-4">
          {/* Main Content */}
          <div className="flex flex-col items-center gap-2 text-center">
            <h3 className="text-xl font-semibold text-foreground">
              {website.title}
            </h3>
            {website.city && (
              <p className="text-sm text-muted-foreground">{website.city}</p>
            )}
          </div>

          {/* Social Links */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {website.instagram && (
              <a
                href={website.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-muted transition-colors duration-200"
                aria-label="Instagram"
              >
                <InstagramIcon className="size-5 text-foreground" />
              </a>
            )}
            {website.facebook && (
              <a
                href={website.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-muted transition-colors duration-200"
                aria-label="Facebook"
              >
                <FacebookIcon className="size-5 text-foreground" />
              </a>
            )}
            {website.youtube && (
              <a
                href={website.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-muted transition-colors duration-200"
                aria-label="YouTube"
              >
                <YouTubeIcon className="size-5 text-foreground" />
              </a>
            )}
            {website.website && (
              <a
                href={website.website}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-muted transition-colors duration-200"
                aria-label="Website"
              >
                <GlobeIcon className="size-5 text-foreground" />
              </a>
            )}
            {website.email && (
              <a
                href={`mailto:${website.email}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-muted transition-colors duration-200"
                aria-label="Email"
              >
                <MailIcon className="size-5 text-foreground" />
              </a>
            )}
            {website.phone && (
              <a
                href={`https://wa.me/${website.countryCode}${website.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-muted transition-colors duration-200"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon className="size-5 text-foreground" />
              </a>
            )}
          </div>

          {/* Attribution */}
          <div className="pt-4 mt-2 w-full">
            <p className="text-sm text-muted-foreground text-center">
              {t("websiteBy")}{" "}
              <a
                href="https://capupet.com"
                target="_blank"
                rel="noopener"
                className="font-medium text-foreground hover:text-foreground transition-colors"
              >
                Capupet
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
