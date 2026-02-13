import { useEffect, useState } from "react";
import {
  buttonColor,
  buttonStyle,
  cardContentStyle,
  cardImageStyle,
  cardStyle,
  containerStyle,
  listStyle,
  titleStyle,
} from "./styles";
import { ugcI18n } from "./ugc-i18n";
import type { Website } from "./types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DEV } from "@/lib/enviroment";

interface Props {
  website: Website;
  apiOrigin: string;
  slug: string;
}

interface Pet {
  id: string;
  name: string;
  image: string | null;
  sex: string;
  count: number;
}

export const MainUGC = ({ website, apiOrigin, slug }: Props) => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [species, setSpecies] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const itemsPerPage = 12;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const t = ugcI18n(website.lang);

  useEffect(() => {
    const fetchPets = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          slug: slug,
          page: String(page),
        });
        if (species) {
          params.append("species", species);
        }

        const response = await fetch(`${apiOrigin}/public/pets?${params}`);
        if (response.ok) {
          const data = await response.json();
          setPets(data);
          if (data.length > 0) {
            setTotalCount(data[0].count);
          } else {
            setTotalCount(0);
          }
        }
      } catch (error) {
        console.error("Error fetching pets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, [slug, page, species, apiOrigin]);

  const handleSpeciesFilter = (selectedSpecies: string | null) => {
    setSpecies(selectedSpecies);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const speciesOptions = ["dog", "cat", "other"];

  return (
    <>
      <main className={containerStyle(website.style)}>
        <div className="mb-12">
          {website.image && (
            <img
              src={website.image}
              alt={website.title}
              className="size-24 mb-4 rounded-full object-cover"
            />
          )}
          <h1 className={titleStyle(website.style)}>{website.title}</h1>
          {website.description && (
            <p className="text-lg text-gray-600">{website.description}</p>
          )}
        </div>

        <section>
          {/* Tabs */}
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => handleSpeciesFilter(null)}
              className={`
            ${buttonStyle(website.style)} ${species === null && buttonColor(website.color)}`}
            >
              {t("all")}
            </button>
            {speciesOptions.map((spec) => (
              <button
                key={spec}
                onClick={() => handleSpeciesFilter(spec)}
                className={`
            ${buttonStyle(website.style)} ${species === spec && buttonColor(website.color)}`}
              >
                {spec === "dog"
                  ? t("dog")
                  : spec === "cat"
                    ? t("cat")
                    : t("other")}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="text-gray-500">{t("loading")}</div>
            </div>
          )}

          {/* No pets found */}
          {!loading && pets.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              {t("noPetsFound")}
            </div>
          )}

          {/* Pets Grid */}
          {!loading && pets.length > 0 && (
            <>
              <div className={listStyle(website.style)}>
                {pets.map((pet) => (
                  <a
                    href={`/${pet.id}`}
                    key={pet.id}
                    className={cardStyle(website.style)}
                  >
                    {pet.image ? (
                      <img
                        src={pet.image}
                        alt={pet.name}
                        className={`${cardImageStyle(website.style)} w-full aspect-4/3 object-cover`}
                      />
                    ) : (
                      <div
                        className={`${cardImageStyle(website.style)} w-full aspect-4/3 bg-gray-200 flex items-center justify-center text-gray-400`}
                      >
                        {t("noImage")}
                      </div>
                    )}
                    <div className={cardContentStyle(website.style)}>
                      <h3 className="font-semibold text-lg mb-1">{pet.name}</h3>
                      <p className="text-sm text-gray-600">
                        {pet.sex === "male"
                          ? t("male")
                          : pet.sex === "female"
                            ? t("female")
                            : pet.sex}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </>
          )}

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-12">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className={`${buttonStyle(website.style)}`}
            >
              <ChevronLeft className="size-5" />
            </button>

            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => {
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= page - 1 && pageNum <= page + 1)
                  ) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`${buttonStyle(website.style)} ${page === pageNum && buttonColor(website.color)}`}
                      >
                        {pageNum}
                      </button>
                    );
                  } else if (pageNum === page - 2 || pageNum === page + 2) {
                    return (
                      <span key={pageNum} className="px-2 py-2 text-gray-500">
                        ...
                      </span>
                    );
                  }
                  return null;
                }
              )}
            </div>

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className={`${buttonStyle(website.style)}`}
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </section>
      </main>
    </>
  );
};
