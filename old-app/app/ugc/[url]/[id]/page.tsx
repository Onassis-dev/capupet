import { api } from "@/lib/api";
import "@/app/globals.css";

type PageProps = {
  params: Promise<{ url: string; id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { url, id } = await params;

  const response = await fetch(api.public.pet.$url({ query: { url, id } }));

  const website = await response.json();

  console.log(website);

  return (
    <main className="max-w-2xl mx-auto pt-12 px-4 flex flex-col items-center">
      <img
        src={website.pet.image}
        alt={website.title}
        className="size-32 rounded-full border"
      />
      <h1 className="text-4xl font-bold mt-2">{website.pet.name}</h1>
      <p className="text-center mt-3">{website.pet.description}</p>
      <div className="grid grid-cols-2 gap-2 sm:gap-4 mt-12"></div>
    </main>
  );
}
