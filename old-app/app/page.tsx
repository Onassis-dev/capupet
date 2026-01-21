import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  const headersList = await headers();
  const acceptLanguage = headersList.get("accept-language") || "";

  const preferredLocale = acceptLanguage.toLowerCase().startsWith("es")
    ? "es"
    : "en";

  redirect(`/${preferredLocale}`);
}
