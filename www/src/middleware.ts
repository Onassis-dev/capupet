import { defineMiddleware } from "astro:middleware";
import { DEV } from "./lib/enviroment";

export const onRequest = defineMiddleware((context, next) => {
  if (DEV) return next();

  const host = context.request.headers.get("host");
  const pathname = context.url.pathname;
  console.log("MIDDLEWARE: ", host, pathname);

  if (/\/ugc-(404|500)\/?$/.test(pathname)) return next(); // I don't like this
  if (pathname.startsWith("/ugc/")) return next("/404");
  if (!host) return next();
  if (!host?.endsWith("capu.pet")) return next();

  const parts = host.split(".");
  const subdomain = parts.length > 2 ? parts.at(-3) : null;

  if (subdomain) {
    return next(`/ugc/${subdomain}${pathname}`);
  }

  return context.redirect(`https://capu.pet${pathname}`);
});
