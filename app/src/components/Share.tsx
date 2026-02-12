import { useI18n } from "@/hooks/use-i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/ui/dropdown-menu";
import { CopyIcon, CheckIcon } from "lucide-react";
import { cloneElement, useState } from "react";

interface props {
  children: React.ReactElement<any>;
  url: string;
  title: string;
}

const Share = ({ url, title, children }: props) => {
  const t = useI18n({
    share: {
      es: "Compartir",
      en: "Share",
    },
    copy: {
      es: "Copiar",
      en: "Copy",
    },
    copied: {
      es: "Copiado",
      en: "Copied",
    },
  });
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const prettyUrl = (url as any)?.replaceAll(" ", "-");
  const encodedUrl = encodeURIComponent(prettyUrl);
  const encondedTitle = encodeURIComponent(
    (title as any)?.replaceAll(" ", "-")
  );

  const FB_LINK = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encondedTitle}`;
  const WA_LINK = `https://wa.me/?text=${encondedTitle}%20${encodedUrl}`;

  const copyLink = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    await navigator.clipboard.writeText(prettyUrl || "");
    setCopied(true);
    setTimeout(() => {
      setOpen(false);
      setCopied(false);
    }, 800);
  };

  const openLink = (link: string) => {
    window.open(link, "_blank");
  };

  const clonedChild = cloneElement(children, {
    onClick: () => {
      navigator.share({
        title: title || "",
        url: prettyUrl || "",
      });
    },
  });

  return (
    <>
      {typeof navigator.share === "function" ? (
        <>{clonedChild}</>
      ) : (
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{t("share")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="flex items-center gap-2"
                onClick={() => openLink(FB_LINK)}
              >
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-4"
                >
                  <path
                    fill="#0866FF"
                    d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"
                  />
                </svg>
                Facebook
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2"
                onClick={() => openLink(WA_LINK)}
              >
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-4"
                >
                  <path
                    fill="#25D366"
                    d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
                  />
                </svg>
                Whatsapp
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2"
                onClick={copyLink}
              >
                {copied ? (
                  <CheckIcon className="size-4 text-green-500" />
                ) : (
                  <CopyIcon className="size-4" />
                )}
                {copied ? t("copied") : t("copy")}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
};

export default Share;
