import { Button } from "@workspace/ui/components/ui/button";
import { useEffect, useState } from "react";
import { APP_ORIGIN } from "@/lib/enviroment";

type HeaderProps = {
  signInText: string;
  startText: string;
};

export function Header({ signInText, startText }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 flex h-16 sm:h-18 items-center bg-background transition-[border-color] ${
        isScrolled ? "border-b" : "border-b border-transparent"
      }`}
    >
      <div className="flex justify-between gap-4 w-full max-w-5xl mx-auto px-4">
        <div>
          <p className="text-2xl font-bold">Capupet</p>
        </div>
        <div></div>
        <div className="flex gap-2">
          <Button variant="ghost" asChild className="hidden sm:flex">
            <a href={`${APP_ORIGIN}`}>{signInText}</a>
          </Button>
          <Button asChild>
            <a href={`${APP_ORIGIN}/signup`}>{startText}</a>
          </Button>
        </div>
      </div>
    </header>
  );
}
