import { api } from "@/lib/api";
import "@/app/globals.css";

type PageProps = {
  params: Promise<{ url: string }>;
};

export default async function Page({ params }: PageProps) {
  const { url } = await params;

  const response = await fetch(api.public.website.$url({ query: { url } }));

  const website = await response.json();

  return (
    <main className="max-w-2xl mx-auto pt-12 px-4 flex flex-col items-center">
      <img
        src={website.image}
        alt={website.title}
        className="size-32 rounded-full border"
      />
      <h1 className="text-4xl font-bold mt-2">{website.title}</h1>
      <p className="text-center mt-3">{website.description}</p>
      <div className="grid grid-cols-2 gap-2 sm:gap-4 mt-12">
        {website.pets.map((pet: Record<string, string>) => (
          <a
            href={`/${url}/${pet.id}`}
            key={pet.id}
            className="border rounded-xl overflow-hidden"
          >
            <img
              src={pet.image}
              alt={pet.name}
              className="w-full aspect-square object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-bold">{pet.name}</h2>
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}
